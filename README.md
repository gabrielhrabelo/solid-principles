# Wellhub API — Learning SOLID Principles

A RESTful API built as a hands-on study of **SOLID principles** applied to a real-world Node.js backend. The project models a gym check-in system inspired by apps like Gympass/Wellhub, and served as a practical playground for applying clean architecture concepts in TypeScript.

---

## Purpose

This project was built with one main goal: **learning how to apply SOLID principles in a real TypeScript/Node.js codebase**, rather than just understanding them in theory. Every architectural decision — from repository interfaces to service factories — was made deliberately to practice one or more of the five principles.

---

## SOLID Principles Applied

### S — Single Responsibility Principle
Each class has one reason to change. Services like `RegisterService`, `AuthenticateService`, and `CheckInService` handle a single domain operation. HTTP controllers only parse input and delegate to services; they don't contain business logic.

### O — Open/Closed Principle
The system is open for extension but closed for modification. Repository interfaces (`UsersRepository`, `CheckInsRepository`, `GymsRepository`) define contracts that can be implemented by different adapters — Prisma for production, in-memory for tests — without changing the services that consume them.

### L — Liskov Substitution Principle
In-memory repository implementations (`InMemoryUsersRepository`, `InMemoryCheckinsRepository`, `InMemoryGymsRepository`) are fully interchangeable with their Prisma counterparts. Unit tests swap them in transparently, and services behave correctly regardless of which implementation is injected.

### I — Interface Segregation Principle
Repository interfaces are kept small and focused. `UsersRepository` only exposes what user-related services need (`findById`, `findByEmail`, `create`). No service is forced to depend on methods it doesn't use.

### D — Dependency Inversion Principle
High-level services depend on abstractions, not concrete implementations. `CheckInService` receives a `CheckInsRepository` and a `GymsRepository` interface through its constructor — it has no knowledge of Prisma. Factory functions (`makeCheckInService`, `makeRegisterService`, etc.) wire the concrete dependencies at the composition root.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24 + TypeScript 6 |
| Framework | Fastify 5 |
| ORM | Prisma 7 + PostgreSQL |
| Auth | JWT (`@fastify/jwt`) + refresh token via cookie |
| Validation | Zod 4 |
| Testing | Vitest 4 + Supertest |
| Linting | Biome |
| Dev server | tsx (watch mode) |
| Build | tsup |
| Container | Docker (Bitnami PostgreSQL) |

---

## Project Structure

```
src/
├── env/                          # Environment validation (Zod)
├── http/
│   ├── controllers/
│   │   ├── users/                # register, authenticate, profile, refresh
│   │   ├── gyms/                 # create, search, fetch-nearby
│   │   └── check-ins/            # create, user-history, user-metrics, validate
│   └── middlewares/              # verifyJWT, verifyUserRole
├── lib/
│   └── prisma.ts                 # Prisma client with pg adapter
├── repositories/
│   ├── prisma/                   # Interfaces + Prisma implementations
│   └── in-memory/                # In-memory implementations (for unit tests)
├── services/                     # Domain use cases + unit tests
│   ├── factories/                # Dependency wiring (composition root)
│   └── errors/                   # Domain error classes
├── types/                        # Module augmentation (@fastify/jwt)
└── utils/                        # Haversine distance calculation
prisma/
├── schema.prisma
├── migrations/
└── vitest-environment-prisma/    # Custom Vitest environment for e2e tests
```

---

## Domain

The API models a gym check-in platform with the following rules:

- Users can register and authenticate (JWT + refresh token rotation)
- Gyms can be created by ADMIN users
- Members can check in to a gym once per day, only if within 100 meters
- Check-ins expire for validation after 20 minutes
- Users can view their check-in history (paginated) and metrics

---

## Getting Started

### Requirements

- Node.js ≥ 24
- Docker + Docker Compose
- pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/gabrielhrabelo/solid-principles.git
cd solid-principles

# Start the database
docker compose up -d

# Install dependencies
pnpm install

# Generate Prisma client
pnpx prisma generate

# Run migrations
pnpx prisma migrate dev

# Start the dev server
pnpm dev
```

The server starts at `http://localhost:3333`.
API docs (Scalar) are available at `http://localhost:3333/docs`.

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL=postgresql://raijin:wellhub@localhost:5432/wellhub
JWT_SECRET=your-secret-here
```

---

## Testing

The project has two test suites:

```bash
# Unit tests (services with in-memory repositories)
pnpm test

# E2E tests (full HTTP stack against an isolated PostgreSQL schema)
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

Unit tests use in-memory repository implementations to keep them fast and free of I/O. E2E tests spin up a dedicated PostgreSQL schema per test file via a custom Vitest environment, then tear it down after each suite.

---

## API Routes

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/users` | — | — | Register a new user |
| POST | `/sessions` | — | — | Authenticate and get JWT |
| PATCH | `/token/refresh` | cookie | — | Rotate refresh token |
| GET | `/me` | bearer | MEMBER | Get authenticated user profile |
| POST | `/gyms` | bearer | ADMIN | Create a gym |
| GET | `/gyms/search` | bearer | MEMBER | Search gyms by query |
| GET | `/gyms/fetch-nearby` | bearer | MEMBER | List gyms within 10 km |
| POST | `/gyms/:gymId/check-ins` | bearer | MEMBER | Check in to a gym |

---

## References

- [SOLID Principles — Wikipedia](https://en.wikipedia.org/wiki/SOLID)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vitest Documentation](https://vitest.dev/)
