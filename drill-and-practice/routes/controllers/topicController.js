import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

// Validation rules for topics
const topicValidationRules = {
    name: [validasaur.required, validasaur.minLength(1)],
    user: [validasaur.required],
};

// Renders topics and requests them from database
const showTopics = async ({ render, state }) => {
    render("topics.eta", { topics: await topicService.listTopics(), user: await state.session.get("user") });
};

// Validates input and adds topic to the database
const addTopic = async ({ request, response, state, render }) => {
    const user = await state.session.get("user");
    if (user.admin) {
        const body = request.body({ type: "form" });
        const params = await body.value;
        const topicData = {
            name: params.get("name"),
            user: user,
        };

        const [passes, errors] = await validasaur.validate(
            topicData,
            topicValidationRules
        );
        if (passes) {
            await topicService.addTopic(topicData.user.id, topicData.name);
            response.redirect("/topics");
        } else {
            console.log(errors);
            topicData.validationErrors = errors;
            topicData.topics = await topicService.listTopics();
            render("topics.eta", topicData);
        }
    }
};

// Renders topic page specified by url parameters.
const showTopic = async ({ render, params }) => {
    const currentTopic = await topicService.listTopic(params.id);
    const currentQuestions = await questionService.listQuestions(params.id);
    render("topic.eta", { topic: currentTopic, questions: currentQuestions });
};

// Deletes topic specified by url parameters
const deleteTopic = async ({ response, params, state }) => {
    const user = await state.session.get("user");
    if (user.admin) {
        await questionService.deleteQuestionWithTopicId(params.id);
        await topicService.deleteTopic(params.id);
    }
    response.redirect("/topics");
};

export { showTopics, addTopic, showTopic, deleteTopic, };