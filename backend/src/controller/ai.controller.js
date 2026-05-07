import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProgressStats } from "../utils/progressStats.js";
import { Question } from "../model/question.model.js";
import { Progress } from "../model/progress.model.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getWeakTopicsPlan = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get stats
        const stats = await getProgressStats(userId);
        const today = new Date();

        // 2. Categorize topics
        const weakList = [];
        const abandonedList = [];
        const activeList = [];

        stats.forEach(s => {
            if (s.solved === 0) return; // Not started

            const lastSolved = new Date(s.lastSolvedAt);
            const daysSince = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));

            if (s.percentage < 40) {
                if (daysSince > 5) {
                    weakList.push(`${s.topic}: ${s.percentage}% — inactive ${daysSince} days`);
                } else {
                    activeList.push(`${s.topic}: ${s.percentage}% — solving daily, ${daysSince} days active`);
                }
            } else {
                if (daysSince > 5) {
                    abandonedList.push(`${s.topic}: ${s.percentage}% — inactive ${daysSince} days`);
                }
                // Strong topics (percentage >= 40 and daysSince <= 5) are ignored as per prompt
            }
        });

        if (weakList.length === 0 && abandonedList.length === 0) {
            return res.status(200).json({
                message: "You are doing great! Keep building your active topics.",
                studyPlan: "No weak or abandoned topics found. Continue your momentum on active topics!",
                stats
            });
        }

        // 3. Build prompt
        const prompt = `You are a helpful DSA mentor.
        
        Student progress summary:
        
        WEAK topics (low progress + inactive 5+ days):
        ${weakList.join("\n") || "None"}
        
        ABANDONED topics (was doing well but stopped):
        ${abandonedList.join("\n") || "None"}
        
        ACTIVE topics (currently building, do not disturb):
        ${activeList.join("\n") || "None"}
        
        Write a short encouraging message (3-4 bullets).
        Focus ONLY on weak and abandoned topics.
        Do not suggest anything about active topics.
        Keep it under 100 words. Plain text only.`;

        // 4. Call Gemini
        const result = await model.generateContent(prompt);
        const studyPlan = result.response.text();

        return res.status(200).json({
            weakTopics: weakList,
            abandonedTopics: abandonedList,
            activeTopics: activeList,
            studyPlan,
            topicStats: stats
        });

    } catch (error) {
        console.error("AI Weak Topics Error:", error);
        return res.status(500).json({ message: "AI analysis failed, but keep practicing!" });
    }
};


const getRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;
        const { sheet } = req.query;

        // 1. Get stats
        const stats = await getProgressStats(userId);

        // 2. Get all solved question IDs
        const solvedProgress = await Progress.find({ user: userId, isDone: true }).select("question");
        const solvedIds = solvedProgress.map(p => p.question);

        // 3. Get candidates for recommendations
        const filter = { _id: { $nin: solvedIds } };
        if (sheet) filter.sheet = sheet;

        const unsolvedQuestions = await Question.find(filter);

        if (unsolvedQuestions.length === 0) {
            return res.status(200).json({ recommendations: [], message: "Congratulations! You've solved all questions." });
        }

        // Sort topics by completion % to identify priority
        const sortedStats = [...stats].sort((a, b) => a.percentage - b.percentage);
        const weakTopicNames = sortedStats.filter(s => s.percentage < 40).map(s => s.topic);
        const mediumTopicNames = sortedStats.filter(s => s.percentage >= 40 && s.percentage < 70).map(s => s.topic);

        let candidates = [];

        // Priority 1: 2 from weak topics
        const weakCandidates = unsolvedQuestions.filter(q => weakTopicNames.includes(q.topic));
        candidates.push(...weakCandidates.sort(() => 0.5 - Math.random()).slice(0, 2));

        // Priority 2: 2 from medium topics
        const mediumCandidates = unsolvedQuestions.filter(q => mediumTopicNames.includes(q.topic));
        candidates.push(...mediumCandidates.sort(() => 0.5 - Math.random()).slice(0, 2));

        // Priority 3: Fill up to 5 total from remaining
        if (candidates.length < 5) {
            const remaining = unsolvedQuestions.filter(q => !candidates.find(c => c._id.toString() === q._id.toString()));
            candidates.push(...remaining.sort(() => 0.5 - Math.random()).slice(0, 5 - candidates.length));
        }

        // 4. Build prompt for Gemini
        const questionsContext = candidates.map(q => `ID: ${q._id}, Title: ${q.title}, Topic: ${q.topic}, Difficulty: ${q.difficulty}`).join("\n");
        const prompt = `User is practicing DSA. Their weakest topics are: ${weakTopicNames.join(", ")}. 
        I have selected these candidate questions for today:
        ${questionsContext}
        
        For each question, write a 1-sentence explanation of why it is important to practice today. 
        Return ONLY a JSON array of objects: [{"questionId": "...", "title": "...", "reason": "..."}]`;

        // 5. Call Gemini
        let recommendations = [];
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            // Clean markdown fences if present
            const cleanJson = text.replace(/```json|```/g, "").trim();
            const aiReasons = JSON.parse(cleanJson);

            // Merge reasons with full data
            recommendations = candidates.map(q => {
                const aiInfo = aiReasons.find(r => r.questionId === q._id.toString() || r.title === q.title);
                return {
                    questionId: q._id,
                    title: q.title,
                    topic: q.topic,
                    difficulty: q.difficulty,
                    link: q.link,
                    reason: aiInfo ? aiInfo.reason : "Great question to improve your skills!"
                };
            });
        } catch (aiError) {
            console.error("Gemini Parse Error:", aiError);
            // Fallback: return candidates without AI reasons
            recommendations = candidates.map(q => ({
                questionId: q._id,
                title: q.title,
                topic: q.topic,
                difficulty: q.difficulty,
                link: q.link,
                reason: "Handpicked for your daily practice."
            }));
        }

        return res.status(200).json({ recommendations });

    } catch (error) {
        console.error("AI Recommendations Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { getWeakTopicsPlan, getRecommendations };
