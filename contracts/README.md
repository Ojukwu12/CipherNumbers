# Contracts

Smart contracts for CipherNumbers FHE demo.

## Network Configuration

- **Network:** Zama FHEVM Testnet
- **Chain ID:** 8009
- **RPC:** https://testnet-api.zama.ai

## Contract

### CipherNumbers.sol

Demonstrates FHE operations:
- `encryptAndStore()` - Store encrypted values
- `homomorphicAdd()` - Add to encrypted number
- `homomorphicMultiply()` - Multiply encrypted number
- `verifyAndDecrypt()` - Decrypt using original secret

## Deployment

```bash
cd contracts
npm install
npx hardhat run scripts/deploy.js --network zama-devnet
```

The deployed contract address will be printed and should be added to your backend `.env` file.
