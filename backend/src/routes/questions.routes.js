import { Router } from "express";
import { getQuestions } from "../controller/questions.controller.js";

const router = Router();

// Public route — no auth needed
router.route("/").get(getQuestions);

export default router;
