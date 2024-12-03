import { sql } from "../database/database.js";

// Query to create a new topic to the database
const addTopic = async (userId, name) => {
    await sql`INSERT INTO topics(user_id, name) VALUES (${userId}, ${name})`;
};

// Query to find all topics in the database
const listTopics = async () => {
    const rows = await sql`SELECT * FROM topics ORDER BY name`;
    return rows;
};

// Query to find a specific topic from the database based on parameter topicId
const listTopic = async (topicId) => {
    const rows = await sql`SELECT * FROM topics WHERE id = ${topicId}`;
    if (rows && rows.length > 0) {
        return rows[0];
    } else {
        return { id: 0, name: "Unknown", user_id: 1 };
    }
};

// Query to delete specific topic from the database based on parameter topicId
const deleteTopic = async (topicId) => {
    await sql`DELETE FROM topics WHERE id = ${topicId}`;
};




export { addTopic, listTopics, listTopic, deleteTopic, };