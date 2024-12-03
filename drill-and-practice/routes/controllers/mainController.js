import * as statisticsService from "../../services/statisticsService.js";

// Renders main page and requests statistics
const showMain = async ({ render }) => {
  const topics = await statisticsService.countAllTopics();
  const questions = await statisticsService.countAllQuestions();
  const answers = await statisticsService.countAllAnswers();
  const statisticData = {
    topicCount: topics.length,
    questionCount: questions.length,
    answerCount: answers.length,
  };
  render("main.eta", statisticData);
};

export { showMain };
