import { sql } from "../database/database.js";

// Query to count all topics for statistics
const countAllTopics = async () => {
    const rows = await sql`SELECT * FROM topics`;
    return rows;
};

// Query to count all questions for statistics
const countAllQuestions = async () => {
    const rows = await sql`SELECT * FROM questions`;
    return rows;
};

// Query to count all answers for statistics
const countAllAnswers = async () => {
    const rows = await sql`SELECT * FROM question_answers`;
    return rows;
};

export { countAllTopics, countAllQuestions, countAllAnswers };