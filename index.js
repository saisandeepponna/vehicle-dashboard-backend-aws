require("dotenv").config();
const mysql = require("mysql2");

// Create database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",  // Allows any origin; change this to your frontend's URL for security
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",  // Allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization",  // Allowed headers
  };

  const path = event.path;
  const method = event.httpMethod;

  // Handle preflight OPTIONS request
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,  // Include CORS headers in the OPTIONS response
      body: "",
    };
  }

  try {
    // Your existing route handling logic
    if (method === "GET" && path === "/indicators") {
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await getIndicators()),
      };
    }

    if (method === "GET" && path.match(/\/indicators\/id\/\d+/)) {
      const id = path.split("/").pop();
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await getIndicatorById(id)),
      };
    }

    if (method === "PUT" && path.match(/\/indicators\/id\/\d+/)) {
      const id = path.split("/").pop();
      const body = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await updateIndicatorStatus(id, body.status)),
      };
    }

    if (method === "GET" && path === "/motor-data") {
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await getMotorData()),
      };
    }

    if (method === "PUT" && path === "/motor-data") {
      const body = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await updateMotorData(body)),
      };
    }

    if (method === "PUT" && path === "/motor-speed") {
      const body = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await updateMotorSpeed(body.rpm)),
      };
    }

    if (method === "PUT" && path === "/motor-power") {
      const body = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await updateMotorPower(body.powerConsumption)),
      };
    }

    if (method === "PUT" && path === "/charging-state") {
      const body = JSON.parse(event.body);
      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify(await updateChargingState(body.charging_state)),
      };
    }

    return {
      statusCode: 404,
      headers,  // Include CORS headers
      body: JSON.stringify({ message: `Route not found: ${path} ${method}` }),
    };
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers,  // Include CORS headers
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};


// Functions for database operations
async function getIndicators() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM indicators", (err, results) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify(results),
      });
    });
  });
}

async function getIndicatorById(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM indicators WHERE id = ?", [id], (err, results) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      if (results.length === 0) {
        reject({ statusCode: 404, body: JSON.stringify({ message: `No indicator found with id ${id}` }) });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify(results[0]),
      });
    });
  });
}

async function updateIndicatorStatus(id, status) {
  if (status !== 0 && status !== 1) {
    return { statusCode: 400, body: JSON.stringify({ message: "Invalid status. Status must be 0 or 1." }) };
  }
  return new Promise((resolve, reject) => {
    db.query("UPDATE indicators SET status = ? WHERE id = ?", [status, id], (err, results) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      if (results.affectedRows === 0) {
        reject({ statusCode: 404, body: JSON.stringify({ message: `Indicator with id ${id} not found.` }) });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: `Indicator with id ${id} updated successfully.` }),
      });
    });
  });
}

async function getMotorData() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM motor_data", (err, results) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify(results[0]),
      });
    });
  });
}

async function updateMotorData(body) {
  const { battery_percentage, battery_temperature, power_consumption } = body;
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE motor_data SET power_consumption = ?, battery_percentage = ?, battery_temperature = ? WHERE id = 1",
      [power_consumption, battery_percentage, battery_temperature],
      (err) => {
        if (err) {
          reject({ statusCode: 500, body: JSON.stringify(err) });
        }
        resolve({ statusCode: 200, body: JSON.stringify({ success: true }) });
      }
    );
  });
}

async function updateMotorSpeed(rpm) {
  return new Promise((resolve, reject) => {
    db.query("UPDATE motor_data SET rpm = ?", [rpm], (err) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      resolve({ statusCode: 200, body: JSON.stringify({ success: true }) });
    });
  });
}

async function updateMotorPower(powerConsumption) {
  return new Promise((resolve, reject) => {
    db.query("UPDATE motor_data SET power_consumption = ?", [powerConsumption], (err) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      resolve({ statusCode: 200, body: JSON.stringify({ success: true }) });
    });
  });
}

async function updateChargingState(charging_state) {
  return new Promise((resolve, reject) => {
    db.query("UPDATE motor_data SET charging_state = ?, rpm = 0", [charging_state], (err) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify(err) });
      }
      resolve({ statusCode: 200, body: JSON.stringify({ success: true }) });
    });
  });
}
