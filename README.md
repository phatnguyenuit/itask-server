# iTask GraphQL Server

![CI/CD](https://github.com/phatnguyenuit/itask-server/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/phatnguyenuit/itask-server/branch/master/graph/badge.svg?token=0JzRGxgu6c)](https://codecov.io/gh/phatnguyenuit/itask-server)
![License](https://img.shields.io/github/license/phatnguyenuit/itask-server)

iTask GraphQL server

## Table of contents
- [iTask GraphQL Server](#itask-graphql-server)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Development](#development)
    - [Production](#production)
  - [Dockerize](#dockerize)
    - [1. Development](#1-development)
    - [2. Production](#2-production)
  - [Setup GitHub Actions](#setup-github-actions)
  - [Scripts](#scripts)
    - [1. Development](#1-development-1)
    - [2. Build](#2-build)
    - [3. Generate type validators](#3-generate-type-validators)
    - [4. Generate GraphQL TypeScript shared types](#4-generate-graphql-typescript-shared-types)
    - [5. Generate both GraphQL TypeScript shared types and type validators](#5-generate-both-graphql-typescript-shared-types-and-type-validators)
    - [6. Generate Prisma client](#6-generate-prisma-client)
    - [7. Migrate Prisma dev environment](#7-migrate-prisma-dev-environment)
    - [8. Deploy Prisma schema](#8-deploy-prisma-schema)
    - [8. Git commit with commitizen CLI](#8-git-commit-with-commitizen-cli)
    - [9. Backup database](#9-backup-database)
    - [10. Restore database](#10-restore-database)
    - [11. Restore database automatically on Docker](#11-restore-database-automatically-on-docker)
    - [12. Unit test](#12-unit-test)
    - [13. Test coverage](#13-test-coverage)
  - [References](#references)

## Features

- RESTful API
- Apollo GraphQL server
- Full TypeScript codebase
- Unit test with Jest
- Dockerize
- Wait for `PostgreSQL` readiness before starting NodeJS server (on the Docker environment)

## Setup

### Prerequisites

1. Prepare ENV files

    Base on `.env.example` file, define your environment variables

    ```sh
    cp .env.example .env
    ```

2. Install `node_modules`

      - Using `npm`:
        
      ```sh
      npm install
      ```

      - Using `yarn`:

      ```sh
      yarn
      ```

### Development

> Start dev server

   - Using `npm`:

     ```sh
     npm run dev:server
     ```

   - Using `yarn`:

     ```sh
     yarn dev:server
     ```

### Production

1. Build production

   - Using `npm`:
   
   ```sh
   npm run build
   ```

   - Using `yarn`:
   
   ```sh
   yarn build
   ```
2. Start production server using PM2

   - Using `npm`:
   
   ```sh
   npm run start:prod
   ```

   - Using `yarn`:
   
   ```sh
   yarn start:prod
   ```

## Dockerize

### 1. Development

- Prepare ENV files

  Base on `.docker.dev.env.example` file, define your environment variables

  ```sh
  cp .docker.dev.env.example .docker.dev.env
  ```

- Start docker compose (`docker-compose.yml & docker-compose.dev.yml`)

  ```
  ./scripts/dev up -d
  ```

- Stop docker compose (`docker-compose.yml & docker-compose.dev.yml`)

  ```
  ./scripts/dev stop
  ```

### 2. Production

- Prepare ENV files

  Base on `.docker.prod.env.example` file, define your environment variables

  ```sh
  cp .docker.prod.env.example .docker.prod.env
  ```

- Start docker compose (`docker-compose.yml & docker-compose.prod.yml`)

  ```
  ./scripts/prod up -d
  ```

- Stop docker compose (`docker-compose.yml & docker-compose.prod.yml`)

  ```
  ./scripts/prod stop
  ```


## Setup GitHub Actions

There are 2 (two) action workflows:

- `test`

  This will be triggered automatically on every open Pull request to `master` branch

  This workflow runs test coverage script during the invocation

- `ci`

  This will be triggered automatically on every open Pull request to `master` branch

  This workflow runs:

  - Test coverage
  - Upload test coverage to `Codecov`
  - Release new version

Required steps:

- Register your repository with `Codecov` to get `CODECOV_TOKEN`
- Configure repository secrets with name `CODECOV_TOKEN`

## Scripts

### 1. Development

> Run & develop

- Using `yarn`:

  ```sh
  yarn dev:server
  ```

- Using `npm`:

  ```sh
  npm run dev:server
  ```

### 2. Build

> Build production source code

- Using `yarn`:

  ```sh
  yarn build
  ```

- Using `npm`:

  ```sh
  npm run build
  ```
### 3. Generate type validators

> Generate TypeScript validator files

- Using `yarn`:

  ```sh
  yarn codegen:validators
  ```

- Using `npm`:

  ```sh
  npm run codegen:validators
  ```

### 4. Generate GraphQL TypeScript shared types

> Generate TypeScript shared types from GraphQL

- Using `yarn`:

  ```sh
  yarn codegen:gql
  ```

- Using `npm`:

  ```sh
  npm run codegen:gql
  ```

### 5. Generate both GraphQL TypeScript shared types and type validators

> Combine [command 3](#3-generate-type-validators) and [command 4](#4-generate-graphql-typescript-shared-types)

- Using `yarn`:

  ```sh
  yarn codegen
  ```

- Using `npm`:

  ```sh
  npm run codegen
  ```

### 6. Generate Prisma client

> Generate Prisma client (`./node_modules/.prisma`)

- Using `yarn`:

  ```sh
  yarn prisma:generate
  ```

- Using `npm`:

```sh
npm run prisma:generate
```

### 7. Migrate Prisma dev environment

> Migrate Prisma schema and apply to database

- Using `yarn`:

  ```sh
  yarn prisma:dev
  ```

- Using `npm`:

  ```sh
  npm run prisma:dev
  ```
### 8. Deploy Prisma schema

> Apply Prisma schema to production environment

- Using `yarn`:

  ```sh
  yarn prisma:deploy
  ```

- Using `npm`:

  ```sh
  npm run prisma:deploy
  ```
### 8. Git commit with commitizen CLI

> Commit CLI command with interactive

- Using `yarn`:

  ```sh
  yarn commit
  ```

- Using `npm`:

  ```sh
  npm run commit
  ```

### 9. Backup database

  ```sh
  pg_dump -v -U $POSTGRES_USER -O -d $POSTGRES_ITASK_DB > path/to/sql/file
  ```

### 10. Restore database

  ```sh
  psql -v -U $POSTGRES_USER -d $POSTGRES_ITASK_DB < path/to/sql/file
  ```

### 11. Restore database automatically on Docker

- Prepare a SQL backup file (named `$POSTGRES_ITASK_DB.sql` with `$POSTGRES_ITASK_DB` is your defined environment variable)
- Place the SQL backup file under `./backup` folder.
- When docker running up, this backup file will be restored automatically.

### 12. Unit test

- Using `npm`:

  ```sh
  npm run test
  ```

- Using `yarn`:

  ```sh
  yarn test
  ```

### 13. Test coverage

 As configuration from `./jest.config.ts` Jest will fail if there is less than `90%` branch, line, and function coverage, or if there are more than `10` uncovered statements:

- Using `npm`:

  ```sh
  npm run test -- --coverage
  ```

- Using `yarn`:

  ```sh
  yarn test --coverage
  ```

## References

- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [Prisma ORM](https://www.prisma.io/docs/getting-started/)
- [Docker - Control startup and shutdown order in Compose](https://docs.docker.com/compose/startup-order/)
- [Wait for it](https://github.com/vishnubob/wait-for-it)