# iTask GraphQL Server

iTask GraphQL server

## Features

- RESTful API
- Apollo GraphQL server
<!-- - Heroku deployment with Dockerfile -->


## Commands

### 1. Push new container to Heroku

Current heroku app name is `itask-api`

```sh
heroku container:push web -a APP_NAME
```

### 2. Release new container to Heroku


```sh
heroku container:release web -a APP_NAME
```

### 3. All in one deploy script


```sh
./scripts/deploy APP_NAME
```

## References

- [Heroku - Container Registry & Runtime (Docker Deploys)](https://devcenter.heroku.com/articles/container-registry-and-runtime)