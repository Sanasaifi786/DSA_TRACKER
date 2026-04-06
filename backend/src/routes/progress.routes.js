import { Router } from "express";
import { toggleProgress, getProgress, getTopicWiseCount } from "../controller/progress.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Sab routes protected hain — login required
router.use(verifyJWT);

router.route("/toggle/:questionId").post(toggleProgress);  // question solve/unsolve karo
router.route("/").get(getProgress);                        // saare solved questions
router.route("/topic-count").get(getTopicWiseCount);       // topic-wise count

export default router;
