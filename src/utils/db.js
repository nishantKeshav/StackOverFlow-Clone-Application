const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2/promise");

let pool;

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

createPool();

async function executeQuery(query,params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = { executeQuery , pool };
