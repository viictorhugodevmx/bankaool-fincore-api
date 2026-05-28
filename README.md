# Bankaool FinCore 360 API

Backend fintech simulation for the Bankaool FinCore 360 lab.

This API simulates a basic fintech/banking operational flow:

- Users and roles
- Customer/KYC profiles
- Digital accounts
- Account movements
- Internal transfers
- Risk review
- Operational approval/rejection
- Customer/account blocking
- Dashboard metrics
- Audit logs

## Stack

- Node.js 20.19.4
- TypeScript 5.9
- Express
- MongoDB 6.0.20
- Mongoose
- JWT
- bcrypt
- Zod
- Postman

## Roles

- admin
- operator
- customer

## Run project

```bash
npm install
npm run dev

Build
npm run build
Seed
npm run seed

Default users:

Role	Email	Password
admin	admin@bankaool.test	Password123
operator	operator@bankaool.test	Password123
customer	victor.customer@bankaool.test	Password123
customer	andrea.customer@bankaool.test	Password123
Environment variables

Create a .env file based on .env.example.

PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/bankaool_fincore_360
JWT_SECRET=replace_with_your_secret
JWT_EXPIRES_IN=1d
Main endpoints
Health
GET /api/health
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
Customers / KYC

Protected for admin/operator.

GET /api/customers
GET /api/customers/:id
PATCH /api/customers/:id/status

Allowed KYC statuses:

pending_kyc
active
blocked
rejected
Accounts

Protected for admin/operator.

POST /api/accounts
GET /api/accounts
GET /api/accounts/:id
GET /api/accounts/customer/:customerId
Movements

Protected for admin/operator.

GET /api/accounts/:accountId/movements
Transfers

Protected for admin/operator.

POST /api/transfers

Transfer statuses:

completed
pending_review
rejected
failed
Transfer risk engine

The transfer module includes a simple risk engine.

Risk rules:

Amount greater than or equal to 20000
Amount exceeds account daily limit
Suspicious words in description

Pending review transfers do not move money until an operator approves them.

Operations

Protected for admin/operator.

GET /api/operations/transfers/pending-review
PATCH /api/operations/transfers/:id/approve
PATCH /api/operations/transfers/:id/reject
PATCH /api/operations/customers/:id/block
PATCH /api/operations/accounts/:id/block
PATCH /api/operations/accounts/:id/unblock
Dashboard

Protected for admin/operator.

GET /api/dashboard/summary
Audit logs

Protected for admin/operator.

GET /api/audit-logs

Tracked actions:

transfer_created
transfer_approved
transfer_rejected
customer_blocked
account_blocked
account_unblocked
Postman

The Postman collection is available at:

postman/Bankaool-FinCore-360-API.postman_collection.json

Recommended flow:

Run seed
Login admin/operator/customer seed users
List customers
List accounts
Create normal transfer
Create risk transfer
Approve/reject pending transfer
Review dashboard
Review audit logs
Notes

This lab intentionally uses a standalone local MongoDB setup. Because of that, transfer operations do not use MongoDB transactions. In a production-like setup, MongoDB replica set transactions would be recommended for financial consistency.


---

# 7. Exportar colección Postman

Exporta de nuevo:

```txt
postman/Bankaool-FinCore-360-API.postman_collection.json