import {Pool} from "pg";
import dotenv from "dotenv";
 
dotenv.config();
 
// TODO
const pool = new Pool({
  host: process.env.DB_HOST,
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database:   process.env.DB_NAME,
});
// Create the pool to connect to the database
// Use the database settings from the .env file


export { pool };
