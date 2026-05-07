import { Question } from "../model/question.model.js";
import { Progress } from "../model/progress.model.js";

export const getProgressStats = async (userId) => {
    // 1. Get total questions count per topic
    const totalQuestionsByTopic = await Question.aggregate([
        {
            $group: {
                _id: "$topic",
                total: { $sum: 1 }
            }
        }
    ]);

    // 2. Get solved questions count AND lastSolvedAt per topic for this user
    const solvedQuestionsByTopic = await Progress.aggregate([
        {
            $match: {
                user: userId,
                isDone: true
            }
        },
        {
            $group: {
                _id: "$topic",
                solved: { $sum: 1 },
                lastSolvedAt: { $max: "$solvedAt" } // Get the most recent solve date
            }
        }
    ]);

    // 3. Merge and calculate percentage
    const stats = totalQuestionsByTopic.map(topicTotal => {
        const topicSolved = solvedQuestionsByTopic.find(s => s._id === topicTotal._id);
        const solvedCount = topicSolved ? topicSolved.solved : 0;
        const lastSolvedAt = topicSolved ? topicSolved.lastSolvedAt : null;
        const percentage = ((solvedCount / topicTotal.total) * 100).toFixed(2);
        
        return {
            topic: topicTotal._id,
            total: topicTotal.total,
            solved: solvedCount,
            percentage: parseFloat(percentage),
            lastSolvedAt
        };
    });

    return stats;
};

