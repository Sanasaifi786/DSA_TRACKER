import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../src/model/question.model.js";
import { User }     from "../src/model/user.model.js";
import { Progress } from "../src/model/progress.model.js";

// Import question data from separate files
import { striverQuestions }    from "./data/striverQuestions.js";
import { lovebabbarQuestions } from "./data/lovebabbarQuestions.js";
import { dailyQuestions }      from "./data/dailyQuestions.js";

import { DB_NAME }  from "../src/constants.js";

dotenv.config();

const allQuestions = [...striverQuestions, ...lovebabbarQuestions, ...dailyQuestions];

const seedDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("✅ MongoDB connected to " + DB_NAME);

        // Clear existing data
        await Question.deleteMany({});
        await Progress.deleteMany({});
        console.log("🗑️  Old questions and progress deleted");

        // Insert all questions
        await Question.insertMany(allQuestions);

        console.log(`✅ Seeded successfully!`);
        console.log(`   📋 Striver:    ${striverQuestions.length} questions`);
        console.log(`   📋 LoveBabbar: ${lovebabbarQuestions.length} questions`);
        console.log(`   📋 Daily:      ${dailyQuestions.length} questions`);
        console.log(`   📦 Total:      ${allQuestions.length} questions`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seedDB();
