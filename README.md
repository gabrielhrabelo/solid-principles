# Learning SOLID Principles with TypeScript, Node.js, Fastify, Docker, PostgreSQL, and Prisma

## Introduction
The SOLID principles are five design principles that help developers create more maintainable and understandable software. These principles aim to make software designs more flexible and easier to refactor over time.

## Overview of SOLID Principles
1. **Single Responsibility Principle (SRP)**: A class should have one, and only one, reason to change. This means that a class should have only one job or responsibility.
   - **Example**: In a Node.js application using Fastify, separate the router logic from business logic.

2. **Open/Closed Principle (OCP)**: Software entities should be open for extension but closed for modification. This encourages software components to be extendable without changing existing code.
   - **Example**: Use interfaces in TypeScript that can be implemented by multiple classes.

3. **Liskov Substitution Principle (LSP)**: Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.
   - **Example**: Ensure that derived classes extend the base class and maintain behavior expected by the client code.

4. **Interface Segregation Principle (ISP)**: Clients should not be forced to depend on interfaces they do not use. It's better to have several small interfaces than a large one.
   - **Example**: Create multiple smaller interfaces for different user roles in your application rather than a single monolithic interface.

5. **Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules; both should depend on abstractions. This principle suggests that the most important part of your application is its interfaces.
   - **Example**: Use Dependency Injection to provide dependencies to classes without hardcoding them.

## Setting Up Your Environment
To get started with learning SOLID principles using TypeScript, Node.js, Fastify, Docker, PostgreSQL, and Prisma, follow these steps:

### Requirements
- Node.js (v14+)
- Docker
- PostgreSQL
- Docker Compose
- TypeScript
- Prisma Client

### Installation Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/gabrielhrabelo/solid-principles.git
   cd solid-principles
   ```

2. **Setup Docker**
   Create a `docker-compose.yml` file for setting up PostgreSQL:
   ```yaml
   version: '3'
   services:
     db:
       image: postgres:latest
       environment:
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
         POSTGRES_DB: solid_db
       ports:
         - "5432:5432"
   ```
   Run the Docker container:
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Initialize Prisma**
   ```bash
   npx prisma init
   ```
   Configure your database connection in `prisma/schema.prisma` and run:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the Application**
   Start your Fastify server:
   ```bash
   npx ts-node src/app.ts
   ```

## Conclusion
In this guide, we've introduced the SOLID principles and outlined steps to set up a development environment that leverages TypeScript, Node.js, Fastify, and PostgreSQL using Docker. Apply these principles to create scalable and maintainable applications!  

## References
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)