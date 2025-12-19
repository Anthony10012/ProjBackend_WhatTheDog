# WhatTheDog API

This is the official documentation for the WhatTheDog API, a backend project for managing customers, dogs, localities, and services.

## Project Description

The WhatTheDog API provides a set of endpoints to interact with a database for a dog-related service. It allows for CRUD (Create, Read, Update, Delete) operations on the following resources:

*   **Customers**: Manage customer information.
*   **Dogs**: Manage information about dogs, including their relationship with customers.
*   **Localities**: Manage locality data.
*   **Services**: Manage the services offered.

The application is built with Node.js, Express, and uses a MySQL2 driver to connect to a MySQL database.

## Installation

To run this project locally, you need to have Node.js and npm installed.

1.  Clone the repository:
    ```bash
    git clone https://github.com/Anthony10012/ProjBackend_WhatTheDog.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd ProjBackend_WhatTheDog
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
The server will start on port 3003 by default.

## API Endpoints

The base URL for all endpoints is `/api`.

### Customers

*   `GET /customers`: Get all customers.
*   `GET /customers/lastname?lastname=<name>`: Get customers by last name.
*   `GET /customers/:id`: Get a customer by ID.
*   `POST /customers`: Create a new customer.
    *   **Body (JSON)**:
        ```json
        {
          "lastname": "string",
          "firstname": "string",
          "email": "string",
          "Locality_idLocality": "integer",
          "Service_idService": "integer"
        }
        ```
*   `PUT /customers/:id`: Update a customer.
    *   **Body (JSON)**:
        ```json
        {
          "lastname": "string",
          "firstname": "string",
          "gender": "string",
          "email": "string",
          "tel_number": "string",
          "postal_address": "string",
          "Locality_idLocality": "integer",
          "Service_idService": "integer"
        }
        ```

### Dogs

*   `GET /dogs`: Get all dogs.
*   `GET /dogs/firstname?firstname=<name>`: Get dogs by firstname.
*   `GET /dogs/:id`: Get a dog by ID.
*   `POST /dogs`: Create a new dog.
    *   **Body (JSON)**:
        ```json
        {
          "firstname": "string",
          "sex": "string",
          "crossing": "boolean",
          "birthdate": "date",
          "dead": "boolean",
          "sterilized": "boolean",
          "Customer_idCustomer": "integer",
          "Race_idRace": "integer"
        }
        ```
*   `PUT /dogs/:id`: Update a dog.
    *   **Body (JSON)**:
        ```json
        {
            "firstname": "string",
            "sex": "string",
            "birthdate": "date",
            "Crossing": "string ('Oui'/'Non')",
            "Dead": "string ('Oui'/'Non')",
            "Sterilized": "string ('Oui'/'Non')",
            "customer_firstname": "string",
            "customer_lastname": "string",
            "idRace": "integer"
        }
        ```

### Locality

*   `GET /locality`: Get all localities.
*   `GET /locality/name?name=<name>`: Get localities by name.
*   `GET /locality/:id`: Get a locality by ID.
*   `POST /locality`: Create a new locality.
    *   **Body (JSON)**:
        ```json
        {
            "name": "string",
            "postal_code": "integer",
            "toponym": "string",
            "canton_code": "string",
            "language_code": "string"
        }
        ```

### Services

*   `GET /service`: Get all services.
*   `GET /service/place?place=<place>`: Get services by place.
*   `GET /service/:id`: Get a service by ID.
