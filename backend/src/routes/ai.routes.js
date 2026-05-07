import { Router } from "express";
import { getWeakTopicsPlan, getRecommendations } from "../controller/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes
router.use(verifyJWT);

router.route("/weak-topics").get(getWeakTopicsPlan);
router.route("/recommend").get(getRecommendations);

export default router;
