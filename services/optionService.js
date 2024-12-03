import { sql } from "../database/database.js";

// Query to list all options of certain question.
const listOptions = async (questionId) => {
    const rows = await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
    return rows;
};

// Query to add option to a question
const addOption = async (questionId, optionText, isCorrect) => {
    await sql`INSERT INTO question_answer_options(question_id, option_text, is_correct) VALUES (${questionId}, ${optionText}, ${isCorrect})`;
};

// Query to delete all answers of certain option
const deleteAnswersByOption = async (optionId) => {
    await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${optionId}`;
};

// Query to delete certain option. Also deletes related answers.
const deleteOption = async (questionId, optionId) => {
    await deleteAnswersByOption(optionId);
    await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId} AND id = ${optionId}`;
};

// Query to find option by id
const optionById = async (questionId, optionId) => {
    const rows = await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND id = ${optionId}`;
    if (rows && rows.length > 0) {
        return rows[0];
    } else {
        return { id: 0, option_text: "Unknown", question_id: 1, is_correct: false };
    }
};

// Query to add answer to the database
const addAnswer = async (userId, questionId, optionId) => {
    await sql`INSERT INTO question_answers(user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${optionId})`;
};

// Query to delete answers by question
const deleteAnswersByQuestionId = async (questionId) => {
    await sql`DELETE FROM question_answers WHERE question_id = ${questionId}`;
};

// Query to delete options by question
const deleteOptionByQuestionId = async (questionId) => {
    await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;
};

// Query to find correct options to a question.
const findCorrectOptions = async (questionId) => {
    const rows = await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct = true`;
    if (rows && rows.length > 0) {
        return rows;
    } else {
        return { id: 0, option_text: "No correct options", question_id: questionId, is_correct: true }
    }
};

export { listOptions, addOption, deleteAnswersByOption, deleteOption, addAnswer, optionById, deleteAnswersByQuestionId, deleteOptionByQuestionId, findCorrectOptions };