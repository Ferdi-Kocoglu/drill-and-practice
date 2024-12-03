import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";
import * as optionService from "../../services/optionService.js";
import { validasaur } from "../../deps.js";

// Validation rules for questions
const questionValidationRules = {
    question_text: [validasaur.required, validasaur.minLength(1)],
    user: [validasaur.required],
};

// Validation rules for options
const optionValidationRules = {
    option_text: [validasaur.required, validasaur.minLength(1)],
    is_correct: [validasaur.required],
};

// Validates input and adds question
const addQuestion = async ({ response, params, request, state, render }) => {
    const body = request.body({ type: "form" });
    const paramsForm = await body.value;

    const questionData = {
        question_text: paramsForm.get("question_text"),
        user: await state.session.get("user"),
        topicId: params.id,
    };

    const [passes, errors] = await validasaur.validate(
        questionData,
        questionValidationRules
    );

    if (passes) {
        await questionService.addQuestion(questionData.user.id, questionData.topicId, questionData.question_text);
        response.redirect(`/topics/${params.id}`);
    } else {
        console.log(errors);
        questionData.validationErrors = errors;
        questionData.topic = await topicService.listTopic(params.id);
        questionData.questions = await questionService.listQuestions(params.id);
        render("topic.eta", questionData);
    }
};

// Shows a question specified by url parameters.
const showQuestion = async ({ render, params }) => {
    const currentQuestion = await questionService.listQuestion(params.id, params.qId);
    const currentOptions = await optionService.listOptions(params.qId);
    render("question.eta", { question: currentQuestion, options: currentOptions })
};

// Validates data and adds answer option to question specified by url parameters.
const addOption = async ({ response, params, request, render }) => {
    const body = request.body({ type: "form" });
    const paramsForm = await body.value;
    let checkbox = false;
    if (paramsForm.get("is_correct")) {
        checkbox = true;
    }

    const optionData = {
        option_text: paramsForm.get("option_text"),
        is_correct: checkbox,
        questionId: params.qId
    };

    const [passes, errors] = await validasaur.validate(
        optionData,
        optionValidationRules
    );
    if (passes) {
        await optionService.addOption(optionData.questionId, optionData.option_text, optionData.is_correct);
        response.redirect(`/topics/${params.id}/questions/${params.qId}`);
    } else {
        console.log(errors);
        optionData.validationErrors = errors;
        optionData.question = await questionService.listQuestion(params.id, params.qId);
        optionData.options = await optionService.listOptions(params.qId);
        render("question.eta", optionData);
    }
};

// Deletes option specified by url parameters
const deleteOption = async ({ response, params }) => {
    await optionService.deleteOption(params.qId, params.oId);
    response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

// Deletes question specified by url parameters
const deleteQuestion = async ({ response, params }) => {
    await questionService.deleteQuestionById(params.qId);
    response.redirect(`/topics/${params.tId}`);
};

export { addQuestion, showQuestion, addOption, deleteOption, deleteQuestion };