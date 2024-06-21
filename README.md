# Project Setup Guide

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/en/download/)
- You have installed [PostgreSQL](https://www.postgresql.org/download/) and it is running

## Installing NestJS

To install NestJS, follow these steps:

1. Open your terminal.
2. Install NestJS globally by running the following command:

```bash
npm i -g @nestjs/cli
```

## Cloning the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/beedyboy/fintech-app.git
cd fintech-app
```

## Installing Dependencies

Install the project dependencies using Yarn:

```bash
yarn install
```

## Setting Up Environment Variables

Create a `.env` file in the root directory of your project and copy the following content into it. Replace the placeholder values with your actual environment variables. or rename the `.env.example`

### Example `.env` file

```plaintext
# Server Configuration
PORT=8080

# Database Configuration
DATABASE_HOST=your_db_host
DATABASE_PORT=your_db_port
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=your_db

# JWT Configuration
JWT_ACCESS_SECRET=youraccesssecret
JWT_REFRESH_SECRET=yourrefreshsecret
JWT_ACCESS_EXPIRATION=36h
```

## Running Database Migrations (if applicable)

If your project includes database migrations, run them using the following command:

```bash
yarn run typeorm migration:run
```

## Starting the Application

Run the application using one of the following commands:

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## Testing

Run the tests using the following commands:

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Using the App

### Step 1: Ensure PostgreSQL is Running

Make sure your PostgreSQL server is running and accessible with the credentials provided in the `.env` file.

### Step 2: Interact with the API using Postman

Use a tool like Postman to interact with the API.

#### Example Request

**Method**: `POST`  
**URL**: `http://localhost:8080/transaction`

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <your-jwt-token>`

**Body** (raw JSON):
```json
{
  "amount": 200,
  "type": "Deposit",
  "paymentMethod": "paypal",
  "description": "Refund"
}
```

## License

Nest is [MIT licensed](LICENSE).

---

### Summary

This guide includes:
1. **Prerequisites**: Necessary installations and machine requirements.
2. **Installing NestJS**: Instructions for installing NestJS CLI.
3. **Cloning the Repository**: Steps to clone the repository and navigate to the project directory.
4. **Installing Dependencies**: Commands to install project dependencies.
5. **Setting Up Environment Variables**: Example of a `.env` file.
6. **Running Database Migrations**: Commands to run database migrations if applicable.
7. **Starting the Application**: Commands to start the application in different modes.
8. **Testing**: Commands to run various tests.
9. **Using the App**: Instructions on ensuring PostgreSQL is running and how to interact with the API using Postman.

By following these steps, you will be able to set up, run, and test the NestJS application on your local machine. If you encounter any issues or have further questions, feel free to reach out for assistance.