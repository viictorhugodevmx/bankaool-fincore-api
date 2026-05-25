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

