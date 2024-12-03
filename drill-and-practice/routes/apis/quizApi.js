import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

// API returns random object and it's options
const quizRandomQuestion = async ({ response }) => {
    const question = await questionService.randomQuestionAnyTopic();
    if (question.id === 0) {
        response.body = {};
    } else {
        const currentOptions = await optionService.listOptions(question.id);
        const returnedObject = {
            questionId: question.id,
            questionText: question.question_text,
            answerOptions: [],
        }
        currentOptions.forEach(option => {
            returnedObject.answerOptions.push({ optionId: option.id, optionText: option.option_text })
        });
        response.body = returnedObject;
    }
};

// API handling answering questions.
const answerQuestionAPI = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const document = await body.value;
    if (document.questionId && document.optionId) {
        const option = await optionService.optionById(document.questionId, document.optionId);
        if (option.is_correct) {
            response.body = { correct: true };
        } else {
            response.body = { correct: false };
        }
    } else {
        response.body = {};
    }
};

export { quizRandomQuestion, answerQuestionAPI };