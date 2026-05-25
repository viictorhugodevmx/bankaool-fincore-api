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

# 22. Commit del Paso 3

Cuando build y Postman estén bien:

```bash
git status
git add .
git commit -m "feat: add auth module with jwt"