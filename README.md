# iTask GraphQL Server

![CI/CD](https://github.com/phatnguyenuit/itask-server/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/phatnguyenuit/itask-server/branch/master/graph/badge.svg?token=0JzRGxgu6c)](https://codecov.io/gh/phatnguyenuit/itask-server)
![License](https://img.shields.io/github/license/phatnguyenuit/itask-server)

iTask GraphQL server

## Table of contents
- [iTask GraphQL Server](#itask-graphql-server)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Commands](#commands)
    - [1. Development](#1-development)
    - [2. Build](#2-build)
    - [3. Generate type validators](#3-generate-type-validators)
    - [4. Generate GraphQL TypeScript shared types](#4-generate-graphql-typescript-shared-types)
    - [5. Generate both GraphQL TypeScript shared types and type validators](#5-generate-both-graphql-typescript-shared-types-and-type-validators)
    - [6. Generate Prisma client](#6-generate-prisma-client)
    - [7. Migrate Prisma dev environment](#7-migrate-prisma-dev-environment)
    - [8. Deploy Prisma schema](#8-deploy-prisma-schema)
    - [8. Git commit with commitizen CLI](#8-git-commit-with-commitizen-cli)
  - [References](#references)

## Features

- RESTful API
- Apollo GraphQL server


## Commands

### 1. Development

Run & develop

- Using `yarn`:


```sh
yarn dev:server
```

- Using `npm`:


```sh
npm run dev:server
```

### 2. Build

Build production source code

- Using `yarn`:


```sh
yarn build
```

- Using `npm`:


```sh
npm run build
```
### 3. Generate type validators

Generate TypeScript validator files

- Using `yarn`:


```sh
yarn codegen:validators
```

- Using `npm`:


```sh
npm run codegen:validators
```

### 4. Generate GraphQL TypeScript shared types

Generate TypeScript shared types from GraphQL

- Using `yarn`:


```sh
yarn codegen:gql
```

- Using `npm`:


```sh
npm run codegen:gql
```

### 5. Generate both GraphQL TypeScript shared types and type validators

Combine [command 3](#3-generate-type-validators) and [command 4](#4-generate-graphql-typescript-shared-types)

- Using `yarn`:


```sh
yarn codegen
```

- Using `npm`:


```sh
npm run codegen
```

### 6. Generate Prisma client

Generate Prisma client (`./node_modules/.prisma`)

- Using `yarn`:


```sh
yarn prisma:generate
```

- Using `npm`:


```sh
npm run prisma:generate
```

### 7. Migrate Prisma dev environment

Migrate Prisma schema and apply to database

- Using `yarn`:


```sh
yarn prisma:dev
```

- Using `npm`:


```sh
npm run prisma:dev
```

### 8. Deploy Prisma schema

Apply Prisma schema to production environment

- Using `yarn`:


```sh
yarn prisma:deploy
```

- Using `npm`:


```sh
npm run prisma:deploy
```

### 8. Git commit with commitizen CLI

Commit CLI command with interactive

- Using `yarn`:


```sh
yarn commit
```

- Using `npm`:


```sh
npm run commit
```

## References

- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [Prisma ORM](https://www.prisma.io/docs/getting-started/)