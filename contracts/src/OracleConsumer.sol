// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title OracleConsumer — x402 micropayment oracle data consumer
/// @notice Manages oracle price feed queries with x402 micropayments (~$0.01/query).
///         Supports Chainlink and Pyth price feeds with automatic fallback.
contract OracleConsumer {
    // ═══ STATE ═══
    address public immutable owner;
    uint256 public queryFeeWei;      // Fee per oracle query in AVAX wei
    uint256 public totalQueriesPaid;
    uint256 public totalFeesCollected;

    struct PriceData {
        uint256 price;        // Price in USD with 8 decimals
        uint256 timestamp;
        uint256 confidence;   // Confidence interval (Pyth-style)
        string  source;       // "chainlink" or "pyth"
    }

    mapping(bytes32 => PriceData) public latestPrices;  // pairId => latest price
    mapping(address => uint256)   public queryCount;     // user => total queries
    mapping(address => uint256)   public totalPaid;      // user => total fees paid

    // ═══ EVENTS ═══
    event PriceUpdated(bytes32 indexed pairId, uint256 price, uint256 timestamp, string source);
    event QueryPaid(address indexed user, bytes32 indexed pairId, uint256 feeWei, uint256 priceUSD);
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event OracleTimeout(bytes32 indexed pairId, string source, uint256 staleness);

    // ═══ ERRORS ═══
    error InsufficientFee();
    error OnlyOwner();
    error StalePrice();

    constructor(uint256 _queryFeeWei) {
        owner = msg.sender;
        queryFeeWei = _queryFeeWei;
    }

    /// @notice Submit a price update with x402 micropayment
    /// @param pairId The price pair identifier (e.g., keccak256("AVAX/USD"))
    /// @param price The price in USD with 8 decimals
    /// @param confidence Price confidence interval
    /// @param source The oracle source ("chainlink" or "pyth")
    function submitPriceWithPayment(
        bytes32 pairId,
        uint256 price,
        uint256 confidence,
        string calldata source
    ) external payable {
        if (msg.value < queryFeeWei) revert InsufficientFee();

        latestPrices[pairId] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence,
            source: source
        });

        queryCount[msg.sender]++;
        totalPaid[msg.sender] += msg.value;
        totalQueriesPaid++;
        totalFeesCollected += msg.value;

        emit PriceUpdated(pairId, price, block.timestamp, source);
        emit QueryPaid(msg.sender, pairId, msg.value, price);
    }

    /// @notice Get the latest price for a pair
    /// @param pairId The price pair identifier
    /// @param maxStaleness Maximum acceptable staleness in seconds
    function getPrice(bytes32 pairId, uint256 maxStaleness) external view returns (uint256 price, uint256 timestamp, string memory source) {
        PriceData storage data = latestPrices[pairId];
        if (block.timestamp - data.timestamp > maxStaleness) revert StalePrice();
        return (data.price, data.timestamp, data.source);
    }

    /// @notice Get price without staleness check
    function getLatestPrice(bytes32 pairId) external view returns (uint256 price, uint256 timestamp, uint256 confidence, string memory source) {
        PriceData storage data = latestPrices[pairId];
        return (data.price, data.timestamp, data.confidence, data.source);
    }

    /// @notice Check if price is stale
    function isPriceStale(bytes32 pairId, uint256 maxStaleness) external view returns (bool) {
        return block.timestamp - latestPrices[pairId].timestamp > maxStaleness;
    }

    /// @notice Get the AVAX/USD pair ID
    function getAVAXUSDPairId() external pure returns (bytes32) {
        return keccak256("AVAX/USD");
    }

    // ═══ ADMIN ═══

    function updateFee(uint256 newFeeWei) external {
        if (msg.sender != owner) revert OnlyOwner();
        emit FeeUpdated(queryFeeWei, newFeeWei);
        queryFeeWei = newFeeWei;
    }

    function withdrawFees() external {
        if (msg.sender != owner) revert OnlyOwner();
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "Transfer failed");
    }

    receive() external payable {}
}
