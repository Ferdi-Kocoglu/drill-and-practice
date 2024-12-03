import { sql } from "../database/database.js";
import * as optionService from "../services/optionService.js";

// Query to create a new question with given parameters
const addQuestion = async (userId, topicId, questionText) => {
    await sql`INSERT INTO questions(user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${questionText})`;
};

// Query to find a specific question based on questionId and topicId parameters
const listQuestion = async (topicId, questionId) => {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId} AND id = ${questionId}`;
    if (rows && rows.length > 0) {
        return rows[0];
    } else {
        return { id: 0, question_text: "Unknown", user_id: 1, topic_id: 1 };
    }
};

// Query to find all questions related to specific topic based on parameter topicId
const listQuestions = async (topicId) => {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
    return rows;
};

// Query to count all questions
const countQuestions = async (topicId) => {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
    return rows.length;
};

// Query to quiz random question
const randomQuestion = async (topicId) => {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY random()`;
    if (rows && rows.length > 0) {
        return rows[0];
    } else {
        return { id: 0, question_text: "Unknown", user_id: 1, topic_id: 1 };
    }
};

// Query to quiz random question from any topic (for API)
const randomQuestionAnyTopic = async () => {
    const rows = await sql`SELECT * FROM questions ORDER BY random()`;
    if (rows && rows.length > 0) {
        return rows[0];
    } else {
        return { id: 0, question_text: "Unknown", user_id: 1, topic_id: 1 };
    }
};

// Query to delete questions with certain topic. Also deletes related questions, options and answers.
const deleteQuestionWithTopicId = async (topicId) => {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
    rows.forEach(async i => {
        await optionService.deleteAnswersByQuestionId(i.id);
        await optionService.deleteOptionByQuestionId(i.id);
    });
    await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;
};

// Query to delete question by id.
const deleteQuestionById = async (questionId) => {
    await optionService.deleteAnswersByQuestionId(questionId);
    await optionService.deleteOptionByQuestionId(questionId);
    await sql`DELETE FROM questions WHERE id = ${questionId}`;
};

export { addQuestion, listQuestion, listQuestions, countQuestions, randomQuestion, randomQuestionAnyTopic, deleteQuestionWithTopicId, deleteQuestionById };