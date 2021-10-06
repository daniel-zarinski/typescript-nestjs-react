## Docs

- [Nest](https://github.com/nestjs/nest)
- [React](https://github.com/facebook/react)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/docs/getting-started)
- [Knex](https://knexjs.org/)
- [Yup](https://github.com/jquense/yup)

## Installation

#### Create a .env file based on the .env.example

```zsh
yarn install

yarn services:start

yarn migration:latest
```

## Running

```bash
# Start & Watch for API & lib changes (Port 8080)
yarn start

# Start React by running webpack dev server (Port 3000)
yarn start:web
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
