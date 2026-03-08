# Contributing to PeakBalance

Thanks for your interest in PeakBalance! This document outlines how to contribute.

## Project Structure

```
PeakBalance-Avalanche-/
├── peakbalance-dashboard/   # Next.js 15 frontend
├── contracts/               # Foundry / Solidity smart contracts
└── agent/                   # Python LangGraph AI agent
```

## Development Setup

### Frontend
```bash
cd peakbalance-dashboard
npm install
npm run dev
```

### Contracts
```bash
cd contracts
forge install
forge build
forge test -vvv
```

### Agent
```bash
cd agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in your keys
python agent.py
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(scope):` — New feature
- `fix(scope):` — Bug fix
- `test(scope):` — Adding tests
- `docs:` — Documentation
- `chore:` — Maintenance

Scopes: `contracts`, `dashboard`, `agent`

## Security

If you discover a security vulnerability, please **do not** open a public issue. Email security@peakbalance.io instead.

## Code Style

- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html), 120 char line length
- **TypeScript**: Strict mode, no `any` types
- **Python**: PEP 8, type hints required
