# API EXAMPLE
Basic Express API with role-based authentication.

# Basic Info
You'll need to obtain environment variables in order to run the application. The `.env.example` outlines the required vars.

The `eslintrc` as a `cjs` file is required by `eslint` until a future version is released which can support commonJS as well as ES modules.

You'll need to add at least one admin user to Mongo in order to use most of the app. There's a script to accomplish this in the `scripts` directory. Use it as follows (with the app running in Docker, per the commands in the Run the App section):
```
$ docker-compose exec api sh
```
that will tunnel into the running `api` container and start a shell. Then, you'll run the node script to add the user:
```
$ node scripts/addUser.js
```
Take note of the username and plaintext password in the `addUser.js` script so you can use them via an HTTP client to hit the `/users/authenticate` endpoint and obtain a valid JWT which will allow you to make calls to the application.

# Run the App

to rebuild image
```
$ docker-compose up --build
```

run in development mode
```
$ docker-compose up
```

run in production mode
```
$ docker-compose -f docker-compose.yml -f production.yml up
```

# Lint the codebase

run eslint:
```
$ npm run lint
```

# Roadmap
* Add tests
* Add limit and sort params to products GET
* Add logging solution
* CI/CD
* Ensure uniform response payloads
* Consider Babel transpilation step in order to add ES2020 proposals
* Add better security headers