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
**URL**: `http://localhost:8080/api/transaction`

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