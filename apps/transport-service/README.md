# Transport Service

Campus transport microservice for SMART CAMPUS UCE - Module 3.

This service manages campus transport routes and seat reservations for students, teachers, and administrators.

## Responsibilities

- Create and manage campus transport routes.
- List available transport routes.
- Register route reservations.
- Track reserved seats per route.
- Expose health checks and Swagger documentation.

## Main Technologies

- NestJS
- PostgreSQL
- TypeORM
- JWT authentication
- Role-Based Access Control
- Swagger
- Docker
- Jest

## Endpoints

- `GET /health`
- `POST /transport/routes`
- `GET /transport/routes`
- `GET /transport/routes/:id`
- `POST /transport/reservations`
- `GET /transport/reservations`
- `DELETE /transport/routes/:id`

## Environment Variables

Use `.env.example` as the base configuration file.

```bash
NODE_ENV=development
PORT=3004
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=smart_campus
DATABASE_PASSWORD=smart_campus
DATABASE_NAME=smart_campus_transport
DATABASE_SYNCHRONIZE=true
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=1h
```

## Local Development

```bash
npm install
npm run start:dev
```

Swagger documentation is available at:

```text
http://localhost:3004/api/docs
```

## Testing

```bash
npm test
npm run build
```

## Docker

```bash
docker build -t transport-service .
docker run --env-file .env -p 3004:3004 transport-service
```
