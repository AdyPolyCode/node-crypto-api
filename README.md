# node-crypto-api

### Table of Contents

1. [General-Information](#general-information)

2. [Features](#features)

3. [Technologies](#technologies)

4. [Documentation](#documentation)

5. [Setup](#setup)

### General-Information

Authentication based personal project. Purpose of this project was learn other way of implementing AUTH, also to learn about websockets. API provides data manipulation only for users who are either signed in & has verified account. Authentication is enabled with JWT which is then signed as a cookie before response. API also provides verification for newly created accounts by MAIL SYSTEM. CRUD operations on products can be made only by valid & authenticated users. Database can store 2 types of users:

-   BASIC: can only fetch resources from the database
-   ADMIN: can do everything

### Features

-   REST API

-   CommonJS

-   Authentication/Authorization:

    -   user role check

    -   user authenticity check

-   Authentication system:

    -   Login

    -   Register

    -   Logout

    -   Account confirmation

    -   Forgot password

    -   Password reset

-   Payload validation

-   Custom errors

-   Documentation

### Technologies

1. Node

2. Express

3. Mongoose

4. RabbitMQ

5. Socket.io

## Documentation

-   internal: http://localhost:{port}/api-docs

### Setup

Steps:

-   install dependencies

-   create environment file

-   run project

```shell

$ npm i

$ touch .env

$ npm run dev

```
