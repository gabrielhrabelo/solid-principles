# Wellhub API — Learning SOLID Principles

A RESTful API built as a hands-on study of **SOLID principles** applied to a real-world Node.js backend. The project models a gym check-in system inspired by apps like Gympass/Wellhub, and served as a practical playground for applying clean architecture concepts in TypeScript.

## Motivation

Reading about SOLID principles is straightforward. Applying them under the pressure of a real feature, with real dependencies and real tradeoffs, is a different challenge entirely. This project exists to bridge that gap.

The domain, a gym check-in platform with authentication, geolocation checks, and role-based access, was chosen because it is complex enough to make architectural decisions meaningful, but contained enough to keep the focus on the principles themselves. Each layer of the codebase, from the repository interfaces to the service factories, reflects a deliberate choice to practice at least one of the five principles rather than reaching for the quickest solution.

The goal was never to ship a production product. It was to build the kind of muscle memory that makes writing maintainable, testable backend code feel natural.

## Purpose

This project was built with one main goal: learning how to apply SOLID principles in a real TypeScript/Node.js codebase, rather than just understanding them in theory. Every architectural decision, from repository interfaces to service factories, was made deliberately to practice one or more of the five principles.

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

## Domain

The API models a gym check-in platform with the following rules:

- Users can register and authenticate (JWT + refresh token rotation)
- Gyms can be created by ADMIN users
- Members can check in to a gym once per day, only if within 100 meters
- Check-ins expire for validation after 20 minutes
- Users can view their check-in history (paginated) and metrics

## Quick Start

You need Node.js 24 or later, Docker with Docker Compose, and pnpm installed before continuing.

```bash
# Clone the repository
git clone https://github.com/gabrielhrabelo/solid-principles.git
cd solid-principles

# Copy and fill in environment variables
cp .env.example .env

# Start the database
docker compose up -d

# Install dependencies
pnpm install

# Generate Prisma client and run migrations
pnpx prisma generate
pnpx prisma migrate dev

# Start the dev server
pnpm dev
```

The server starts at `http://localhost:3333` and the interactive API docs (Scalar) are available at `http://localhost:3333/docs`.

### Environment Variables

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL=postgresql://raijin:wellhub@localhost:5432/wellhub
JWT_SECRET=your-secret-here
```

## Usage

Once the server is running, all endpoints are documented and interactively explorable at `http://localhost:3333/docs` via Scalar. Below is a typical flow to get started manually.

### Register and authenticate

```bash
# Create an account
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{ "name": "Gabriel", "email": "gabriel@example.com", "password": "123456" }'

# Authenticate and receive a JWT
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{ "email": "gabriel@example.com", "password": "123456" }'
```

The `/sessions` response returns a short-lived `token` in the body and sets a `refreshToken` cookie for rotation.

### Use protected routes

```bash
# Get your profile
curl http://localhost:3333/me \
  -H "Authorization: Bearer <token>"

# Search for gyms
curl "http://localhost:3333/gyms/search?query=acad&page=1" \
  -H "Authorization: Bearer <token>"

# Check in to a gym
curl -X POST http://localhost:3333/gyms/<gymId>/check-ins \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "latitude": -16.678, "longitude": -49.233 }'
```

### Refresh a token

```bash
curl -X PATCH http://localhost:3333/token/refresh \
  --cookie "refreshToken=<your-refresh-token>"
```

### Running tests

```bash
# Unit tests (services with in-memory repositories, no database needed)
pnpm test

# E2E tests (full HTTP stack against an isolated PostgreSQL schema)
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

Unit tests use in-memory repository implementations to keep them fast and free of I/O. E2E tests spin up a dedicated PostgreSQL schema per test file via a custom Vitest environment, then tear it down after each suite.

## API Routes

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/users` | none | none | Register a new user |
| POST | `/sessions` | none | none | Authenticate and get JWT |
| PATCH | `/token/refresh` | cookie | none | Rotate refresh token |
| GET | `/me` | bearer | MEMBER | Get authenticated user profile |
| POST | `/gyms` | bearer | ADMIN | Create a gym |
| GET | `/gyms/search` | bearer | MEMBER | Search gyms by query |
| GET | `/gyms/fetch-nearby` | bearer | MEMBER | List gyms within 10 km |
| POST | `/gyms/:gymId/check-ins` | bearer | MEMBER | Check in to a gym |

## Contributing

This is primarily a learning project, but contributions that improve the code quality, add missing tests, or demonstrate SOLID principles more clearly are welcome.

### Getting your environment ready

Follow the Quick Start section above to get the project running locally. Make sure both test suites pass before opening a pull request.

```bash
pnpm test
pnpm test:e2e
```

### Guidelines

Keep pull requests focused. A single PR should address one concern, whether that is fixing a bug, adding a test, refactoring a service, or introducing a new feature. Mixing unrelated changes makes review harder.

Follow the existing patterns. New services should depend on repository interfaces, not on Prisma directly. New endpoints should delegate all logic to a service and keep the controller thin. If a new use case needs a factory function, add one in `src/services/factories/`.

Respect the linting rules. The project uses Biome for formatting and linting. Run `pnpm biome check --write .` before committing to avoid CI failures.

Write tests. Unit tests belong in `src/services/` alongside the service file. E2E tests belong in `src/http/controllers/` alongside the controller. In-memory repository implementations in `src/repositories/in-memory/` should be kept up to date with their interface counterparts.

### Opening a pull request

Fork the repository, create a branch with a descriptive name, push your changes, and open a pull request against `main`. Describe what the change does and why, and reference any relevant issue if one exists.

## References

- [SOLID Principles — Wikipedia](https://en.wikipedia.org/wiki/SOLID)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vitest Documentation](https://vitest.dev/)
