# TaskFlow Microservices

TaskFlow is a full-stack microservices project built with Spring Boot, Spring Cloud Gateway, JWT authentication, React, and Docker Compose.

## Modules

- `api-gateway` - routes all external requests
- `auth-service` - registration and login with JWT
- `project-service` - project CRUD
- `task-service` - task CRUD
- `notification-service` - mock notification endpoints
- `frontend` - React app

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Cloud Gateway
- Spring Data JPA
- H2 Database
- React + Vite
- Docker Compose

## Run locally

### Backend
Open separate terminals for each service and run:

```bash
cd auth-service && mvn spring-boot:run
cd project-service && mvn spring-boot:run
cd task-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Gateway runs on `http://localhost:8080`

## Default flow

1. Register a user
2. Login and get JWT
3. Create projects
4. Create tasks inside a project
5. Update task status

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

### Tasks
- `GET /api/tasks/project/{projectId}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## Docker

```bash
docker compose up --build
```

## Notes

This is a clean starter project suitable for GitHub, portfolio use, interview explanation, and further expansion with Kafka, Redis, PostgreSQL, service discovery, config server, tracing, and CI/CD.
