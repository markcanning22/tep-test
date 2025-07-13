# TepTest

## Run tasks

### First time setup
To set up the project for the first time, run:

```sh
sh ./scripts/setup.sh
```

### Dev server

To run the dev server:

```sh
npx nx run user:serve:local
```

You can then access the application at http://localhost:3000.

You can access the docs via http://localhost:3000/docs.

### Tests

To run all tests:

```sh
npx nx run-many -t test
```

To run E2E tests

```sh
npx nx run-many -t e2e
```

## Improvements

- Improve the API feedback (the default Fastify errors are not always user-friendly).
- Improve the API documentation (add more details, examples, etc.).
- Add authentication
- Add versioning (allow the user to specify what version of the API they want to use).
- Complete CI/CD pipeline with automatic deployments to AWS
- Complete AWS lambda deployment script
- Add CORS
- Clean up my commits
- Configure pino logger for better logging (env and app names, mapping of log levels)
