import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

// Renders the quiz topics page and requests topics in the database.
const showQuizes = async ({ render }) => {
    render("quizTopics.eta", { topics: await topicService.listTopics() });
};

// Selects random question from the database with topic in the database.
const selectRandomQuestion = async ({ render, response, params }) => {
    const questionCount = await questionService.countQuestions(params.tId);
    if (questionCount <= 0) {
        render("noQuestions.eta");
    } else {
        const randomQuestion = await questionService.randomQuestion(params.tId);
        response.redirect(`/quiz/${params.tId}/questions/${randomQuestion.id}`);
    }
};

// Quizes a question with id set up url and requests the related answer options
const quizQuestion = async ({ render, params }) => {
    const currentOptions = await optionService.listOptions(params.qId);
    render("quizQuestion.eta", { question: await questionService.listQuestion(params.tId, params.qId), options: currentOptions });
};

// Chooses a answer option and adds the answer to database. Redirects to show whether answer was correct.
const chooseOption = async ({ response, params, state }) => {
    const user = await state.session.get("user");
    await optionService.addAnswer(user.id, params.qId, params.oId);
    const option = await optionService.optionById(params.qId, params.oId);
    if (option.is_correct) {
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
    } else {
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
    }
};

// Renders correct answer page and shows the question specified by url parameters.
const correctAnswer = async ({ render, params }) => {
    render("quizCorrect.eta", { question: await questionService.listQuestion(params.tId, params.qId) });
};

// Renders incorrect answer page and shows the question specified by url parameters. Also requests correct option(s) to display them.
const incorrectAnswer = async ({ render, params }) => {
    const correctAnswers = await optionService.findCorrectOptions(params.qId);
    render("quizIncorrect.eta", { question: await questionService.listQuestion(params.tId, params.qId), correctOptions: correctAnswers });
};

export { showQuizes, selectRandomQuestion, quizQuestion, chooseOption, correctAnswer, incorrectAnswer };