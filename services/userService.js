import { sql } from "../database/database.js";

// Adds user to database
const addUser = async (email, password) => {
    await sql`INSERT INTO users(email, password) VALUES (${email}, ${password})`;
};

// Finds user from the database by email
const findUserByEmail = async (email) => {
    const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows;
};

export { addUser, findUserByEmail };