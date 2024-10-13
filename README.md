## Description

Location Devices Management Application.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Features

### User Management

- **User Authentication and Authorization**
  - Users can register and log in using JWT for authentication.
  
- **User Roles and Permissions**
  - Only SuperAdmin users can create new users with SuperAdmin, Admin, or User roles.
  - Admin users can create only User role accounts.
  - User role accounts are not permitted to create any type of users.

### Location & Devices Management

- **Permissions for Creating and Managing Locations and Devices**
  - Only SuperAdmin and Admin roles can create, update, and soft delete locations and devices (soft delete is achieved by setting the `isDeleted` flag to true in the database).
  - Only SuperAdmin can permanently delete locations and devices from the database.
  - User role accounts have view-only permissions regarding locations and devices.


## Instructions

- Create a PostgreSQL database for this project
    - Import the provided sql dump.
- Provide the database credentials and other necessary details in a .env file.
    - DB_TYPE
    - DB_HOST
    - DB_PORT
    - DB_USERNAME
    - DB_PASSWORD
    - DB_DATABASE
    - DB_SYNCHRONIZE
    - JWT_SECRET (Ex: Any Secret Key)
    - ACCESS_TOKEN_EXPIRES_IN (Ex: 5m, 1h)
- Execute the start command to initialize the project.
- Import the provided postman collection to test APIs

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

