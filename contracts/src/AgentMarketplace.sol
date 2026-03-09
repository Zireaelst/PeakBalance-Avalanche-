// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentRegistry} from "./AgentRegistry.sol";
import {StakingVault} from "./StakingVault.sol";
import {IERC20} from "./interfaces/IERC20.sol";

interface IReputationAggregator {
    function updateSubscriberCount(uint256 agentId, uint256 count) external;
    function applySlashPenalty(uint256 agentId) external;
}

interface IFeeDistributor {
    function splitSubscriptionFee(uint256 agentId, uint256 amount) external;
}

interface IPeakVault {
    function authorizeAgent(address agent) external;
    function revokeAgent(address agent) external;
    function authorizedAgent(address user) external view returns (address);
}

/// @title AgentMarketplace — Curated listing, subscription, and fee routing
/// @notice Central coordination layer. Holds NO user funds.
///         Only metadata and authorization mappings.
contract AgentMarketplace {
    // ═══ TYPES ═══
    enum ListingStatus { PENDING, ACTIVE, PAUSED, DELISTED }

    struct AgentListing {
        uint256        agentId;
        address        owner;
        address        agentWallet;      // IMMUTABLE after approval
        string         name;             // max 32 chars enforced off-chain
        string         strategyType;     // BALANCED | AVAX_HEAVY | STABLE_HEAVY | MULTI
        string         metadataURI;      // IPFS URI → JSON
        uint96         monthlySubFee;    // USDC (6 decimals). 0 = free
        uint16         performanceFeeBps;// 0-500 (max 5%)
        uint16         protocolFeeBps;   // fixed 50 bps — only protocol can change
        ListingStatus  status;
        uint256        listedAt;
        uint256        lastUpdated;
    }

    struct Subscription {
        address user;
        uint256 agentId;
        uint256 startTime;
        uint256 nextBillingTime;   // startTime + 30 days
        bool    active;
        address vaultAddress;
    }

    // ═══ STATE ═══
    AgentRegistry          public immutable registry;
    StakingVault           public immutable stakingVault;
    IReputationAggregator  public reputationAggregator;
    IFeeDistributor        public feeDistributor;
    IERC20                 public immutable usdc;

    address public admin;
    uint16  public protocolFeeBps = 50;    // 0.5% — hard cap at 100 bps

    mapping(uint256 agentId => AgentListing)                         public listings;
    mapping(address user    => uint256 agentId)                      public activeSubscription;
    mapping(address user    => mapping(uint256 agentId => Subscription)) public subscriptions;
    mapping(uint256 agentId => address[])                            private _subscriberArr;
    mapping(uint256 agentId => uint256)                             public subscriberCount;
    mapping(address user    => mapping(uint256 agentId => uint256))  private _subscriberIndex; // 1-indexed

    uint256[] public activeListingIds;
    mapping(uint256 agentId => uint256 idx) private _listingIndex; // 1-indexed into activeListingIds

    // ═══ EVENTS ═══
    event ApplicationSubmitted(uint256 indexed agentId, address indexed owner, uint256 timestamp);
    event ListingApproved(uint256 indexed agentId, uint256 timestamp);
    event ListingRejected(uint256 indexed agentId, string reason);
    event ListingPaused(uint256 indexed agentId);
    event AgentDelisted(uint256 indexed agentId, address indexed initiator);
    event Subscribed(address indexed user, uint256 indexed agentId, address vault);
    event Unsubscribed(address indexed user, uint256 indexed agentId);
    event ProtocolFeeUpdated(uint16 newBps);
    event AdminTransferred(address newAdmin);

    // ═══ ERRORS ═══
    error OnlyAdmin();
    error NotAgentOwner();
    error AlreadyApplied();
    error StakeNotEligible();
    error FeeTooHigh(uint256 bps, uint256 max);
    error AgentNotActive();
    error MustUnsubFirst();
    error NotSubscribed();
    error HasSubscribers();
    error ProtocolFeeTooHigh(uint256 bps, uint256 max);
    error ZeroAddress();
    error EmptyName();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    constructor(
        address _registry,
        address _stakingVault,
        address _usdc
    ) {
        if (_registry == address(0) || _stakingVault == address(0) || _usdc == address(0))
            revert ZeroAddress();
        registry     = AgentRegistry(_registry);
        stakingVault = StakingVault(payable(_stakingVault));
        usdc         = IERC20(_usdc);
        admin        = msg.sender;
    }

    // ═══ ADMIN WIRING ═══

    function setReputationAggregator(address ra) external onlyAdmin {
        reputationAggregator = IReputationAggregator(ra);
    }

    function setFeeDistributor(address fd) external onlyAdmin {
        feeDistributor = IFeeDistributor(fd);
    }

    // ═══ STEP 1: AGENT OWNER APPLIES ═══

    /// @notice Submit a listing application. Requires prior 10 AVAX stake in StakingVault.
    function applyForListing(
        uint256 agentId,
        address agentWallet,
        string calldata name_,
        string calldata strategyType,
        string calldata metadataURI,
        uint96  monthlySubFee,
        uint16  performanceFeeBps_
    ) external {
        if (registry.ownerOf(agentId) != msg.sender) revert NotAgentOwner();
        if (!stakingVault.isEligible(agentId))        revert StakeNotEligible();
        if (performanceFeeBps_ > 500)                  revert FeeTooHigh(performanceFeeBps_, 500);
        if (listings[agentId].status != ListingStatus(0) && listings[agentId].agentId != 0)
            revert AlreadyApplied();
        if (bytes(name_).length == 0) revert EmptyName();

        listings[agentId] = AgentListing({
            agentId:          agentId,
            owner:            msg.sender,
            agentWallet:      agentWallet,
            name:             name_,
            strategyType:     strategyType,
            metadataURI:      metadataURI,
            monthlySubFee:    monthlySubFee,
            performanceFeeBps: performanceFeeBps_,
            protocolFeeBps:   protocolFeeBps,
            status:           ListingStatus.PENDING,
            listedAt:         0,
            lastUpdated:      block.timestamp
        });

        emit ApplicationSubmitted(agentId, msg.sender, block.timestamp);
    }

    // ═══ STEP 3: ADMIN APPROVES ═══

    function approveListing(uint256 agentId) external onlyAdmin {
        AgentListing storage l = listings[agentId];
        l.status    = ListingStatus.ACTIVE;
        l.listedAt  = block.timestamp;
        l.lastUpdated = block.timestamp;

        activeListingIds.push(agentId);
        _listingIndex[agentId] = activeListingIds.length; // 1-indexed

        emit ListingApproved(agentId, block.timestamp);
    }

    // ═══ STEP 4: ADMIN REJECTS ═══

    function rejectListing(uint256 agentId, string calldata reason) external onlyAdmin {
        listings[agentId].status = ListingStatus.DELISTED;
        listings[agentId].lastUpdated = block.timestamp;
        emit ListingRejected(agentId, reason);
    }

    // ═══ STEP 5: USER SUBSCRIBES ═══

    /// @notice Subscribe to an agent. Vault must be caller's PeakVault address.
    function subscribe(uint256 agentId, address vaultAddress) external {
        AgentListing storage l = listings[agentId];
        if (l.status != ListingStatus.ACTIVE)       revert AgentNotActive();
        if (!stakingVault.isEligible(agentId))       revert StakeNotEligible();
        if (activeSubscription[msg.sender] != 0)     revert MustUnsubFirst();

        // Handle subscription fee
        if (l.monthlySubFee > 0) {
            usdc.transferFrom(msg.sender, address(feeDistributor), l.monthlySubFee);
            if (address(feeDistributor) != address(0)) {
                feeDistributor.splitSubscriptionFee(agentId, l.monthlySubFee);
            }
        }

        // Grant agent role on user's vault
        IPeakVault(vaultAddress).authorizeAgent(l.agentWallet);

        subscriptions[msg.sender][agentId] = Subscription({
            user:            msg.sender,
            agentId:         agentId,
            startTime:       block.timestamp,
            nextBillingTime: block.timestamp + 30 days,
            active:          true,
            vaultAddress:    vaultAddress
        });

        _subscriberArr[agentId].push(msg.sender);
        _subscriberIndex[msg.sender][agentId] = _subscriberArr[agentId].length; // 1-indexed
        subscriberCount[agentId]++;
        activeSubscription[msg.sender] = agentId;

        if (address(reputationAggregator) != address(0)) {
            reputationAggregator.updateSubscriberCount(agentId, subscriberCount[agentId]);
        }

        emit Subscribed(msg.sender, agentId, vaultAddress);
    }

    // ═══ STEP 6: USER UNSUBSCRIBES ═══

    function unsubscribe(uint256 agentId) external {
        Subscription storage s = subscriptions[msg.sender][agentId];
        if (!s.active) revert NotSubscribed();

        // CRITICAL: Revoke role BEFORE updating state (CEI for role safety)
        IPeakVault(s.vaultAddress).revokeAgent(listings[agentId].agentWallet);

        s.active = false;
        subscriberCount[agentId]--;
        activeSubscription[msg.sender] = 0;

        if (address(reputationAggregator) != address(0)) {
            reputationAggregator.updateSubscriberCount(agentId, subscriberCount[agentId]);
        }

        emit Unsubscribed(msg.sender, agentId);
    }

    // ═══ STEP 7: DELIST ═══

    function delistAgent(uint256 agentId) external {
        AgentListing storage l = listings[agentId];
        bool isOwner = l.owner == msg.sender;
        bool isAdminCall = msg.sender == admin;
        if (!isOwner && !isAdminCall) revert NotAgentOwner();
        if (isOwner && subscriberCount[agentId] > 0) revert HasSubscribers();

        l.status = ListingStatus.DELISTED;
        l.lastUpdated = block.timestamp;
        _removeFromActive(agentId);

        emit AgentDelisted(agentId, msg.sender);
    }

    // ═══ ADMIN EMERGENCY FUNCTIONS ═══

    function pauseListing(uint256 agentId) external onlyAdmin {
        listings[agentId].status = ListingStatus.PAUSED;
        listings[agentId].lastUpdated = block.timestamp;
        emit ListingPaused(agentId);
    }

    /// @notice Slash agent stake AND pause listing in one call
    function slashAndPause(uint256 agentId, uint16 bps, string calldata reason) external onlyAdmin {
        stakingVault.slash(agentId, bps, reason);
        if (address(reputationAggregator) != address(0)) {
            reputationAggregator.applySlashPenalty(agentId);
        }
        listings[agentId].status = ListingStatus.PAUSED;
        listings[agentId].lastUpdated = block.timestamp;
        emit ListingPaused(agentId);
    }

    /// @notice Force-revoke AGENT_ROLE on all of an agent's subscribers' vaults
    function forceUnsubscribeAll(uint256 agentId) external onlyAdmin {
        address agentWallet = listings[agentId].agentWallet;
        address[] storage subs = _subscriberArr[agentId];
        for (uint256 i = 0; i < subs.length; i++) {
            address user = subs[i];
            Subscription storage sub = subscriptions[user][agentId];
            if (sub.active) {
                IPeakVault(sub.vaultAddress).revokeAgent(agentWallet);
                sub.active = false;
                activeSubscription[user] = 0;
                emit Unsubscribed(user, agentId);
            }
        }
        subscriberCount[agentId] = 0;
    }

    function setProtocolFee(uint16 bps) external onlyAdmin {
        if (bps > 100) revert ProtocolFeeTooHigh(bps, 100);
        protocolFeeBps = bps;
        emit ProtocolFeeUpdated(bps);
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert ZeroAddress();
        admin = newAdmin;
        emit AdminTransferred(newAdmin);
    }

    // ═══ VIEW FUNCTIONS ═══

    function getActiveListings() external view returns (uint256[] memory) {
        return activeListingIds;
    }

    function getSubscribers(uint256 agentId) external view returns (address[] memory) {
        return _subscriberArr[agentId];
    }

    // ═══ INTERNAL ═══

    function _removeFromActive(uint256 agentId) internal {
        uint256 idx = _listingIndex[agentId];
        if (idx == 0) return;
        uint256 lastId = activeListingIds[activeListingIds.length - 1];
        activeListingIds[idx - 1] = lastId;
        _listingIndex[lastId] = idx;
        activeListingIds.pop();
        delete _listingIndex[agentId];
    }
}
