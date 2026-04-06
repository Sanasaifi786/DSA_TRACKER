import { Progress } from "../model/progress.model.js";
import { Question } from "../model/question.model.js";

const toggleProgress = async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user._id;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const existProgress = await Progress.findOne({
            user: userId,
            question: questionId
        });

        if (existProgress) {
            existProgress.isDone = !existProgress.isDone;
            await existProgress.save();
            return res.status(200).json({
                message: "Progress toggled successfully",
                isDone: existProgress.isDone
            });
        }

        await Progress.create({
            user: userId,
            question: questionId,
            topic: question.topic,
            isDone: true
        });
        return res.status(201).json({ message: "Progress created successfully", isDone: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Saare solved questions return karo (isDone = true)
const getProgress = async (req, res) => {
    try {
        const userId = req.user._id;  // bug fix: was user._id

        const progress = await Progress.find({ user: userId, isDone: true })
            .select("question topic isDone solvedAt");

        return res.status(200).json({
            message: "Progress fetched successfully",
            progress
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Topic-wise solved count — MongoDB aggregation use karke
const getTopicWiseCount = async (req, res) => {
    try {
        const userId = req.user._id;

        /*
         aggregation pipeline:
         1. $match   — sirf is user ke solved (isDone=true) records lo
         2. $group   — topic ke hisaab se group karo aur count karo
         3. $project — clean output banao { topic, solvedCount }
        */
        const result = await Progress.aggregate([
            {
                $match: {
                    user: userId,
                    isDone: true
                }
            },
            {
                $group: {
                    _id: "$topic",          // topic pe group
                    solvedCount: { $sum: 1 } // har entry ke liye +1
                }
            },
            {
                $project: {
                    _id: 0,
                    topic: "$_id",
                    solvedCount: 1
                }
            },
            {
                $sort: { topic: 1 }  // alphabetically sort karo
            }
        ]);

        // Array ko object mein convert karo: { "Arrays": 3, "Strings": 2 }
        const topicWise = {};
        for (const item of result) {
            topicWise[item.topic] = item.solvedCount;
        }

        return res.status(200).json({
            message: "Topic-wise count fetched successfully",
            topicWise
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { toggleProgress, getProgress, getTopicWiseCount };