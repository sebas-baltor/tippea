# TIPPEA

## Install dependencies for frontend and backend
```js
    pnpm install
```

## If you get lost please look at the documentation of interledger
[Official documentation](https://openpayments.dev/sdk/before-you-begin/)
[Repo](https://github.com/interledger/open-payments-node)

## Porpuse

This project pretend to be a bridge between small bussines, creator or people that want to be tiped, at the cheapes price and with 0 complications using and open protocol for payments, with the posibility to embed a qr code to let the people start tiping you. 

### Overview

This project demonstrates a complete, multi-step payment flow using the Interledger Protocol (ILP). It is divided into two main components:

/frontend: A React application that provides a user interface to simulate and interact with the payment flow.

/backend: (Conceptual) The API server responsible for handling the core Interledger logic, communicating with an ILP-enabled wallet or provider, and executing the payment steps.

The frontend/ directory contains a React component (payment-flow.jsx) that mocks the entire end-to-end user journey for both receiving and sending a payment.

Project Structure
```
/
├── frontend/
│   ├── src/
│   │   ├── components/
│   └── ... (Other frontend files)
│
└── backend/
    └── ... (API server, controllers, services)
```

## The Payment Flow

The core of this project is the backend-driven payment flow, which is simulated by the frontend. The flow is split into two distinct parts: the Receiver's flow and the Sender's flow.

#### Part 1: Receive Payment (Receiver's Flow)

Before a payment can be sent, the receiver must first create an "incoming payment" request.

User Input (Frontend): The receiver enters their walletId and the amount they wish to receive.

API Call (Backend): The frontend sends this information to the backend.

`POST /payment/incoming-payment`

`Body: { "walletId": "...", "amount": "..." }`

Backend Logic: The backend service communicates with the Interledger provider to create a payment request.

API Response (Backend): The backend receives a response from the provider and forwards it to the frontend. This response contains a crucial piece of information:

id: The unique Incoming Payment ID (e.g., https://ilp.interledger-test.dev/.../incoming-payments/...).

Action (Frontend): The receiver copies this incomingPaymentId and sends it to the person who will be paying (the "sender").

#### Part 2: Send Payment (Sender's Flow)

The sender uses the incomingPaymentId from Part 1 to initiate and complete the payment. This is a complex, multi-step process orchestrated by the backend.

Step 2a: Get a Quote

User Input (Frontend): The sender provides their own senderWalletId and pastes the incomingPaymentId they received.
```bash
API Call (Backend):

POST /payment/quote

Body: { "walletId": "...", "incomingPaymentId": "..." }
```

Backend Logic: The backend fetches a quote from the ILP provider. This quote "locks in" the exchange rate and fees, detailing exactly how much the sender will be debited (debitAmount) to satisfy the receiver's receiveAmount.

API Response (Backend): The backend returns the quote data, including a unique quoteId.

`Response: { "quoteId": "...", "debitAmount": { ... }, "receiveAmount": { ... } }`

Step 2b: Create a Grant

User Action (Frontend): The user sees the quote (e.g., "Send 5.42 USD to deliver 100.00 MXN") and agrees to proceed.
```bash
API Call (Backend):

POST /payment/grant

Body: { "walletId": "...", "debitAmount": { ... } }
```

Backend Logic: The backend requests a grant (permission) from the user's wallet to debit the specified amount. This step handles user authentication and consent.

API Response (Backend): The provider returns a response with:

interact.redirect: A URL to redirect the user to for authentication (e.g., a bank login page).

continue.access_token: A token to be used in the next step.

Step 2c: Finalize the Outgoing Payment

User Action (Frontend): The user would (in a real scenario) be redirected to the interact.redirect URL, log in, and approve the transaction. They are then redirected back to the application.

API Call (Backend): The frontend, now armed with the quoteId and the continue.access_token, makes the final call to execute the payment.
```bash
POST /payment/outgoing-payment

Body: { "walletId": "...", "quoteId": "...", "continueToken": "..." }
```

Backend Logic: The backend sends the "go" signal to the ILP provider, using the quote and the auth token to finalize the transaction.

API Response (Backend): The backend returns a final status, such as COMPLETED, indicating the payment has been successfully sent.