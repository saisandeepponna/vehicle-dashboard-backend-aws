# vehicle-dashboard-backend-aws

This repository contains a Node.js-based serverless AWS Lambda function that interacts with a MySQL database to provide an API for managing motor data and indicators. 

The vehicle_dashboard application handles various HTTP methods (GET, PUT) to retrieve and update data, with built-in support for CORS, error handling, and environment variable configuration.

It a flexible and scalable solution for building RESTful APIs integrated with MySQL database in cloud environments.



# Setup

Create a .env file with the database credentials from AWS RDS MySQL. Then craete the REST APIs for all the routes on API Gateway 

# API Endpoints:
GET /api/indicators: Fetch all indicators.

GET /api/indicators/id/:id: Fetch a specific indicator by ID.

PUT /api/indicators/id/:id: Update the status of a specific indicator.

GET /api/motor-data: Fetch the motor data.

PUT /api/motor-data: Update motor data (battery percentage, power consumption, etc.).

PUT /api/motor-speed: Update motor speed (RPM).

PUT /api/motor-power: Update motor power consumption.

PUT /api/charging-state: Toggle charging state.

# For read-only RDS access, creds are

DB_HOST=database-1.c1smk4iw4l5q.us-east-2.rds.amazonaws.com

DB_USER=read

DB_PASSWORD=epiroc

DB_NAME=vehicle_dashboard

Use these to see the database setup on MySQL Workbench, since RDS is a paid service I will start the RDS instance once you test it


Contact me at email: ponnasaisandeep@gmail.com or call (506) 898-3190


