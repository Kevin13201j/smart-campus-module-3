# Library Service

## Description

The `library-service` is a NestJS microservice for the Smart Campus UCE project.  
It manages books, availability, loans, and returns for the university library.

## Main Features

- Book management
- Book search
- Book availability control
- Book loans
- Book returns
- JWT authentication
- RBAC authorization
- Swagger API documentation
- PostgreSQL persistence
- Docker support

## Technology Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Passport
- Swagger
- Docker

## Architecture

This service applies:

- Microservices Architecture
- Layered Architecture
- Hexagonal Architecture principles
- Database per service
- SOLID principles

## Environment Variables

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=smart_campus
DB_PASSWORD=smart_campus
DB_NAME=library_db

JWT_SECRET=smart-campus-library-secret
JWT_EXPIRES_IN=8h
````

## Run Locally

```bash
npm install
npm run start:dev
```

## Swagger Documentation

```text
http://localhost:3001/api/docs
```

## Health Check

```text
GET /health
```

## API Endpoints

### Auth

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login user    |

### Books

| Method | Endpoint                | Description    |
| ------ | ----------------------- | -------------- |
| GET    | `/books`                | List books     |
| GET    | `/books/search?q=value` | Search books   |
| GET    | `/books/:id`            | Get book by ID |
| POST   | `/books`                | Create book    |
| PATCH  | `/books/:id`            | Update book    |
| DELETE | `/books/:id`            | Disable book   |
| POST   | `/books/:id/loan`       | Loan book      |
| POST   | `/books/:id/return`     | Return book    |

## Roles

| Role      | Permissions                          |
| --------- | ------------------------------------ |
| ADMIN     | Full access                          |
| LIBRARIAN | Manage books and loans               |
| STUDENT   | Search, view, loan, and return books |

## Docker Build

```bash
docker build -t library-service .
```

## Docker Run

```bash
docker run -p 3001:3001 library-service
```

## Testing

```bash
npm run test
```

## Status

Current version includes book CRUD, search, loans, returns, JWT authentication, RBAC authorization, Swagger documentation, and Docker support.

````