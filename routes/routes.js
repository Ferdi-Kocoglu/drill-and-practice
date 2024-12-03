import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as registarationController from "./controllers/registarationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as quizApi from "./apis/quizApi.js";

const router = new Router();

// Different routes for the app:
router.get("/", mainController.showMain);
router.get("/topics", topicController.showTopics);
router.post("/topics", topicController.addTopic);
router.get("/topics/:id", topicController.showTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);
router.post("/topics/:id/questions", questionController.addQuestion);
router.get("/topics/:id/questions/:qId", questionController.showQuestion);
router.post("/topics/:id/questions/:qId/options", questionController.addOption);
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);
router.post("/topics/:tId/questions/:qId/options/:oId/delete", questionController.deleteOption);
router.get("/auth/register", registarationController.showRegistarationForm);
router.post("/auth/register", registarationController.registerUser);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);
router.get("/auth/logout", loginController.logout);
router.get("/quiz", quizController.showQuizes);
router.get("/quiz/:tId", quizController.selectRandomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.quizQuestion);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.chooseOption);
router.get("/quiz/:tId/questions/:qId/correct", quizController.correctAnswer);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.incorrectAnswer);
router.get("/api/questions/random", quizApi.quizRandomQuestion);
router.post("/api/questions/answer", quizApi.answerQuestionAPI);

export { router };
