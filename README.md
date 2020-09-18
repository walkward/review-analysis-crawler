> IMPORTANT: Please see [DESIGN.md](DESIGN.md) document before getting started!

## Prerequisites

Docker Compose is used to simplify running the application. See below for install details.

- Make sure docker is installed
  - For Mac: https://www.docker.com/docker-mac
  - For Windows: https://www.docker.com/docker-windows
  - For Ubuntu: https://www.docker.com/docker-ubuntu
- Refer to https://docs.docker.com/compose/gettingstarted/ for a short Docker Compose tutorial

## Testing

Use the following to run the testing suite:

```sh
docker-compose -f docker-compose.test.yml up --build
```

## Running

Use the following to run the services:

```sh
docker-compose -f docker-compose.prod.yml up --build
```

> NOTE: After the application has finished you may safely exit docker-compose by running `ctrl + c`
