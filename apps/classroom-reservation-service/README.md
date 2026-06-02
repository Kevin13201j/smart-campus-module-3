# Classroom Reservation Service

## Overview

The Classroom Reservation Service is part of the Smart Campus UCE distributed platform.

This microservice is responsible for managing academic classrooms and reservations while preventing scheduling conflicts. It provides secure APIs for students, professors, and administrators and supports future integrations with notification, QR access, and space availability services.

---

## Features

### Classroom Management

* Create classrooms
* Update classrooms
* Delete classrooms
* Get classroom information
* Get available classrooms

### Reservation Management

* Create reservations
* Update reservations
* Cancel reservations
* Approve reservations
* Reject reservations
* Retrieve reservation information

### Business Rules

* Prevent overlapping reservations
* Validate classroom availability
* Role-based access control
* JWT authentication
* Event publication through Kafka
* Real-time updates through WebSocket

---

## Architecture

### Architectural Patterns

* Microservices Architecture
* Event-Driven Architecture
* Hexagonal Architecture
* Layered Architecture
* Database per Service Pattern

### Communication

| Type             | Technology |
| ---------------- | ---------- |
| REST API         | NestJS     |
| Real-Time Events | WebSocket  |
| Event Streaming  | Kafka      |

---

## Technology Stack

### Backend

* NestJS
* TypeScript
* PostgreSQL
* TypeORM

### Security

* JWT Authentication
* RBAC Authorization
* Validation Pipes
* Guards
* CORS
* Rate Limiting

### DevOps

* Docker
* Docker Compose
* GitHub Actions
* Turborepo

### Monitoring

* Health Checks
* Prometheus (Future Integration)
* Grafana (Future Integration)

---

## Project Structure

```text
src/

├── application
│   ├── dto
│   └── use-cases
│
├── domain
│   ├── entities
│   ├── enums
│   └── repositories
│
├── infrastructure
│   ├── database
│   ├── kafka
│   ├── websocket
│   └── repositories
│
├── presentation
│   ├── controllers
│   ├── guards
│   ├── decorators
│   └── strategies
│
└── config
```

---

## Database

Database Name:

```text
classroom_reservation_db
```

### Tables

#### classrooms

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | VARCHAR   |
| building   | VARCHAR   |
| floor      | INTEGER   |
| capacity   | INTEGER   |
| type       | VARCHAR   |
| status     | ENUM      |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

#### reservations

| Column           | Type      |
| ---------------- | --------- |
| id               | UUID      |
| classroom_id     | UUID      |
| user_id          | UUID      |
| reservation_date | DATE      |
| start_time       | TIME      |
| end_time         | TIME      |
| purpose          | TEXT      |
| status           | ENUM      |
| created_at       | TIMESTAMP |
| updated_at       | TIMESTAMP |

---

## User Roles

### ADMIN

* Manage classrooms
* Approve reservations
* Reject reservations
* Cancel reservations

### PROFESSOR

* Create reservations
* Update reservations
* Approve reservations
* Reject reservations

### STUDENT

* Create reservations
* Cancel reservations

---

## API Endpoints

### Classrooms

```http
GET /classrooms
GET /classrooms/:id
POST /classrooms
PATCH /classrooms/:id
DELETE /classrooms/:id
GET /classrooms/available
```

### Reservations

```http
GET /reservations
GET /reservations/:id
POST /reservations
PATCH /reservations/:id
DELETE /reservations/:id
POST /reservations/:id/approve
POST /reservations/:id/reject
POST /reservations/:id/cancel
```

---

## Kafka Events

Published Events:

```text
reservation.created
reservation.approved
reservation.rejected
reservation.cancelled
```

Future Consumers:

```text
notification-service
qr-access-service
space-availability-service
```

---

## WebSocket Events

```text
reservation.created
reservation.approved
reservation.rejected
reservation.cancelled
```

---

## Environment Variables

```env
PORT=3002

DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=classroom_reservation_db

JWT_SECRET=smart-campus-classroom-secret
JWT_EXPIRES_IN=8h

KAFKA_BROKER=localhost:9092

CORS_ORIGIN=http://localhost:3000
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run application:

```bash
npm run start:dev
```

Swagger:

```text
http://localhost:3002/api/docs
```

Health Check:

```text
http://localhost:3002/health
```

---

## Docker

Build image:

```bash
docker build -t classroom-reservation-service .
```

Run containers:

```bash
docker compose up -d
```

---

## Testing

Run unit tests:

```bash
npm run test
```

Run integration tests:

```bash
npm run test:e2e
```

---

## CI/CD

GitHub Actions pipeline includes:

* Dependency installation
* Build validation
* Unit testing
* Pull Request validation

---

## Future Enhancements

* Notification Service Integration
* QR Access Integration
* Space Availability Integration
* Prometheus Metrics
* Grafana Dashboards
* RabbitMQ Integration
* GraphQL API
* gRPC Communication

---

## Authors

Smart Campus UCE

Distributed Programming Course

Universidad Central del Ecuador
