# CipherNumbers - Developer Guide

## Overview

CipherNumbers is a full-stack FHE (Fully Homomorphic Encryption) demo with:
- **Backend**: Express.js REST API with FHE operations
- **Frontend**: React SPA with modern UI
- **Contracts**: Solidity smart contracts for Zama FHEVM
- **Deployment**: Ready for Render hosting

---

## Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Encryption**: Custom FHE utilities (ready for Zama SDK integration)
- **Middleware**: CORS, Error Handling, Async/Await
- **Port**: 3001

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: CSS3 with CSS Variables
- **API Client**: Fetch API with error handling
- **Port**: 3000

### Smart Contracts
- **Language**: Solidity 0.8.19
- **Framework**: Hardhat
- **Network**: Zama FHEVM Testnet (Chain ID: 8009)
- **Library**: fhevm (Zama FHE library)

---

## File Structure & Responsibilities

### Backend

```
backend/
├── src/
│   ├── index.js                 # Express app setup & server
│   ├── controllers/
│   │   └── fheController.js     # FHE operation handlers
│   ├── routes/
│   │   └── fheRoutes.js         # API endpoint definitions
│   ├── middleware/
│   │   ├── corsMiddleware.js    # CORS configuration
│   │   └── errorHandler.js      # Global error handler
│   └── utils/
│       ├── AppError.js          # Custom error class
│       ├── asyncHandler.js      # Async route wrapper
│       └── fheUtils.js          # FHE business logic
├── package.json
├── .env.example
└── render.json                  # Render deployment config
```

**Key Concepts:**

1. **Separation of Concerns**
   - Controllers: Request/response handling
   - Routes: API endpoint definitions
   - Utils: Business logic
   - Middleware: Cross-cutting concerns

2. **Error Handling**
   - `AppError` class for consistent error formatting
   - `asyncHandler` wrapper to catch Promise rejections
   - Global error middleware for centralized handling

3. **FHE Pipeline**
   - `initializeEncryptionContext()`: Create session
   - `encryptNumber()`: Encrypt plaintext
   - `homomorphicAdd/Multiply()`: Compute on encrypted data
   - `decryptResult()`: Decrypt using original secret
   - `verifyDecryption()`: Validate decryption context

### Frontend

```
frontend/
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main app component & state
│   ├── index.css                # Global styles
│   ├── components/
│   │   ├── InputField.jsx       # Text input with validation
│   │   ├── Button.jsx           # Reusable button component
│   │   ├── Modal.jsx            # Dialog component
│   │   ├── Alert.jsx            # Alert messages
│   │   └── ResultDisplay.jsx    # Encrypted/decrypted results
│   ├── pages/                   # (Optional) Page components
│   └── utils/
│       └── api.js               # Backend API client
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── render.json
```

**Key Concepts:**

1. **Component Architecture**
   - Functional components with hooks
   - Single responsibility
   - Reusable, composable UI

2. **State Management**
   - Local state in App.jsx
   - Four-step flow: Encrypt → Operate → Verify → Display
   - Error and loading states

3. **API Integration**
   - `api.js` centralizes all backend calls
   - Consistent error handling
   - Environment-based URL configuration

4. **Styling**
   - CSS Variables for theming
   - Mobile-responsive design
   - Accessibility considerations

### Contracts

```
contracts/
├── CipherNumbers.sol            # Main FHE contract
├── hardhat.config.js            # Hardhat configuration
├── package.json
├── scripts/
│   └── deploy.js                # Deployment script
└── README.md                    # Contract documentation
```

**Key Concepts:**

1. **FHE Contract**
   - Accepts encrypted values
   - Performs operations on encrypted data
   - Returns encrypted results
   - Verification mechanism for decryption

2. **Deployment**
   - Target: Zama FHEVM Testnet
   - Uses Hardhat for compilation & deployment
   - Private key management via .env

---

## API Endpoints

### 1. Initialize Session
**Purpose**: Create an encryption context for the user

```
POST /api/fhe/init
Response:
{
  "success": true,
  "data": {
    "sessionId": "abc123...",
    "timestamp": 1234567890,
    "algorithm": "TFHE-FHE",
    "status": "initialized"
  }
}
```

### 2. Encrypt Number
**Purpose**: Encrypt a plaintext number (backend reference)

```
POST /api/fhe/encrypt
Body:
{
  "plaintext": 42,
  "sessionId": "abc123..."
}

Response:
{
  "success": true,
  "data": {
    "ciphertext": "base64_encoded_ciphertext...",
    "sessionId": "abc123...",
    "encryptionTime": 1234567890,
    "isEncrypted": true
  }
}
```

### 3. Compute Addition
**Purpose**: Perform homomorphic addition on encrypted number

```
POST /api/fhe/compute/add
Body:
{
  "encryptedNumber": { /* encrypted object */ },
  "operand": 10
}

Response:
{
  "success": true,
  "data": {
    "result": "encrypted_result...",
    "operation": "add",
    "operand": 10,
    "sessionId": "abc123...",
    "isEncrypted": true
  }
}
```

### 4. Compute Multiplication
**Purpose**: Perform homomorphic multiplication

```
POST /api/fhe/compute/multiply
Body:
{
  "encryptedNumber": { /* encrypted object */ },
  "operand": 5
}

Response:
{
  "success": true,
  "data": {
    "result": "encrypted_result...",
    "operation": "multiply",
    "operand": 5,
    "sessionId": "abc123...",
    "isEncrypted": true
  }
}
```

### 5. Decrypt Result
**Purpose**: Decrypt result using original secret

```
POST /api/fhe/decrypt
Body:
{
  "encryptedResult": { /* encrypted result object */ },
  "originalPlaintext": 42
}

Response:
{
  "success": true,
  "data": {
    "decryptedValue": 52,
    "operation": "add",
    "originalValue": 42,
    "operand": 10,
    "proof": "Result matches expected computation"
  }
}
```

### 6. Health Check
**Purpose**: Verify backend is running

```
GET /api/fhe/health
Response:
{
  "success": true,
  "message": "FHE backend is healthy",
  "timestamp": "2025-12-20T..."
}
```

---

## Frontend State Flow

```
1. Initialize
   ├── GET /api/fhe/init
   └── Store sessionId

2. User enters secret (42)
   ├── POST /api/fhe/encrypt
   └── Store encryptedNumber

3. User chooses operation (add) and operand (10)
   ├── POST /api/fhe/compute/add
   └── Store encryptedResult

4. Show Decrypt Modal
   ├── Ask user to re-enter secret
   └── Verify matches original

5. User confirms secret
   ├── POST /api/fhe/decrypt
   └── Display decryptedValue
```

---

## Environment Configuration

### Backend (.env)
```env
NODE_ENV=development              # development | production
PORT=3001                         # Server port
CORS_ORIGIN=http://localhost:3000 # Frontend URL
ZAMA_RELAYER_URL=...              # Zama FHE endpoint
ZAMA_NETWORK=testnet              # Network name
ZAMA_PROJECT_ID=...               # Project ID
ZAMA_PRIVATE_KEY=...              # Private key for contract
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001 # Backend URL
```

---

## Development Workflow

### 1. Local Setup
```bash
# Install all dependencies
bash setup.sh

# Or manually:
cd backend && npm install && cp .env.example .env
cd ../frontend && npm install && cp .env.example .env
cd ../contracts && npm install
```

### 2. Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App on http://localhost:3000
```

### 3. Testing the Flow
1. Visit http://localhost:3000
2. Enter secret number: `42`
3. Choose operation: `Add`
4. Enter operand: `10`
5. Verify with secret: `42`
6. See result: `52`

---

## Deployment

### Deploy to Render

#### Backend
1. Push to GitHub
2. Create Web Service on Render
3. Build: `npm install`
4. Start: `npm start`
5. Environment variables:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=<frontend_url>`
   - Zama vars

#### Frontend
1. Push to GitHub
2. Create Static Site on Render
3. Build: `npm install && npm run build`
4. Publish dir: `dist`
5. Environment: `VITE_API_URL=<backend_url>`

### Deploy Contracts
```bash
cd contracts
export PRIVATE_KEY=<your_private_key>
npx hardhat run scripts/deploy.js --network zama-devnet
```

---

## Security Considerations

1. **Secret Management**
   - Never log plaintext values
   - Store secrets only on client
   - Use sessionId for context

2. **Encryption**
   - Plaintext encrypted before transmission
   - Ciphertext never decrypted on server
   - Verification required for decryption

3. **CORS**
   - Whitelist frontend URL
   - Prevent cross-origin attacks

4. **Error Handling**
   - Don't expose sensitive stack traces
   - Log security events
   - Fail gracefully

---

## Testing Checklist

- [ ] Backend starts on port 3001
- [ ] Frontend starts on port 3000
- [ ] Health check returns success
- [ ] Can encrypt a number
- [ ] Can add to encrypted number
- [ ] Can multiply encrypted number
- [ ] Decryption requires correct secret
- [ ] Wrong secret fails decryption
- [ ] Results are mathematically correct
- [ ] CORS allows frontend requests
- [ ] Error messages are clear

---

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Ensure `CORS_ORIGIN` in backend .env matches frontend URL
- Check frontend's `VITE_API_URL` matches backend URL

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite Build Issues
```bash
# Clear Vite cache
rm -rf frontend/.vite
npm run build
```

---

## Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Zama Docs](https://docs.zama.ai/)
- [Hardhat Docs](https://hardhat.org/)

---

## Contributing

1. Follow the existing code structure
2. Add comments explaining "why", not just "what"
3. Keep components modular and reusable
4. Test locally before pushing
5. Update .env.example when adding variables

---

## Support

For issues or questions:
1. Check README.md for overview
2. Review this guide for architecture
3. Check API endpoint documentation
4. Review code comments in implementation

---

**Built with ❤️ for FHE Education**
