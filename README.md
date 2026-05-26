# Bankaool FinCore 360 API

Backend fintech simulation for the Bankaool FinCore 360 lab.

## Stack

- Node.js 20.19.4
- TypeScript 5.9
- Express
- MongoDB 6.0.20
- Mongoose
- Postman

## Run project

```bash
npm install
npm run dev
```

## Health check
GET http://localhost:4000/api/health

## Expected response:

{
  "success": true,
  "message": "Bankaool FinCore 360 API is running",
  "data": {
    "service": "bankaool-fincore-api",
    "status": "ok"
  }
}

# Postman

The Postman collection is available at:

postman/Bankaool-FinCore-360-API.postman_collection.json


Ojo: cuando pegues esto, si se te rompe por los bloques markdown internos, puedes pegarlo manualmente por secciones.

## Development test endpoints

Temporary endpoints used to validate middlewares and error handling.

### Validation success

```http
POST /api/dev/validate-test
```
Body:

{
  "name": "Victor",
  "amount": 500
}
Validation error
POST /api/dev/validate-test

Body:

{
  "name": "V",
  "amount": -10
}
Controlled error
GET /api/dev/error-test

Si el markdown se te acomoda raro, no pasa nada; lo importante es que quede documentado.

## Auth endpoints

### Register

```http
POST /api/auth/register
```
{
  "name": "Victor Customer",
  "email": "victor.customer@bankaool.test",
  "password": "Password123",
  "role": "customer"
}

Login
POST /api/auth/login

Body:

{
  "email": "victor.customer@bankaool.test",
  "password": "Password123"
}
Current user
GET /api/auth/me

Header:

Authorization: Bearer <token>

Si se te desacomoda el markdown por los bloques internos, pégalo por secciones, como hemos hecho.

---

## Seed users

Run:

```bash
npm run seed

Default users:

Role	Email	Password
admin	admin@bankaool.test	Password123
operator	operator@bankaool.test	Password123
customer	victor.customer@bankaool.test	Password123
customer	andrea.customer@bankaool.test	Password123

---

## Customers / KYC endpoints

Protected endpoints for admin and operator roles.

### List customers

```http
GET /api/customers

Header:

Authorization: Bearer <admin_or_operator_token>
Get customer detail
GET /api/customers/:id
Update customer KYC status
PATCH /api/customers/:id/status

Body:

{
  "kycStatus": "active"
}

Allowed statuses:

pending_kyc
active
blocked
rejected

## Accounts endpoints

Protected endpoints for admin and operator roles.

### Create account

```http
POST /api/accounts

Body:

{
  "customerId": "customer_id",
  "initialBalance": 10000,
  "currency": "MXN",
  "dailyLimit": 10000,
  "monthlyLimit": 80000
}

List accounts
GET /api/accounts
Get account detail
GET /api/accounts/:id
Get accounts by customer
GET /api/accounts/customer/:customerId

---

## Movements endpoints

Protected endpoint for admin and operator roles.

### Get account movements

```http
GET /api/accounts/:accountId/movements


## Transfers endpoints

Protected endpoint for admin and operator roles.

### Create transfer

```http
POST /api/transfers

Body:

{
  "fromAccountId": "from_account_id",
  "toAccountId": "to_account_id",
  "amount": 5000,
  "description": "Internal transfer test"
}