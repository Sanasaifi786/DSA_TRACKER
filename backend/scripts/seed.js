import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../src/model/question.model.js";

dotenv.config({ path: "./.env" });

const striverQuestions = [
    // Arrays
    { title: "Two Sum", topic: "Arrays", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/", order: 1, sheet: "striver" },
    { title: "Best Time to Buy and Sell Stock", topic: "Arrays", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", order: 2, sheet: "striver" },
    { title: "Contains Duplicate", topic: "Arrays", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/", order: 3, sheet: "striver" },
    { title: "Product of Array Except Self", topic: "Arrays", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/", order: 4, sheet: "striver" },
    { title: "Maximum Subarray", topic: "Arrays", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/", order: 5, sheet: "striver" },

    // Strings
    { title: "Valid Anagram", topic: "Strings", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/", order: 6, sheet: "striver" },
    { title: "Valid Palindrome", topic: "Strings", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/", order: 7, sheet: "striver" },
    { title: "Longest Substring Without Repeating Characters", topic: "Strings", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", order: 8, sheet: "striver" },

    // Linked List
    { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/", order: 9, sheet: "striver" },
    { title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/", order: 10, sheet: "striver" },
    { title: "Linked List Cycle", topic: "Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/", order: 11, sheet: "striver" },

    // Trees
    { title: "Invert Binary Tree", topic: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/", order: 12, sheet: "striver" },
    { title: "Maximum Depth of Binary Tree", topic: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", order: 13, sheet: "striver" },
    { title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", order: 14, sheet: "striver" },

    // Dynamic Programming
    { title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/", order: 15, sheet: "striver" },
    { title: "House Robber", topic: "Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/", order: 16, sheet: "striver" },
    { title: "Longest Common Subsequence", topic: "Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/longest-common-subsequence/", order: 17, sheet: "striver" },

    // Graphs
    { title: "Number of Islands", topic: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/", order: 18, sheet: "striver" },
    { title: "Clone Graph", topic: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/", order: 19, sheet: "striver" },
];

const dailyQuestions = [
    { title: "Two Sum", topic: "Arrays", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/", order: 1, sheet: "daily" },
    { title: "Valid Parentheses", topic: "Stack", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/", order: 2, sheet: "daily" },
    { title: "Merge Sorted Array", topic: "Arrays", difficulty: "Easy", link: "https://leetcode.com/problems/merge-sorted-array/", order: 3, sheet: "daily" },
    { title: "Binary Search", topic: "Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/", order: 4, sheet: "daily" },
    { title: "Flood Fill", topic: "Graphs", difficulty: "Easy", link: "https://leetcode.com/problems/flood-fill/", order: 5, sheet: "daily" },
];

const seedDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/DSATracker`);
        console.log("✅ MongoDB connected!");

        // Purane questions delete karo
        await Question.deleteMany({});
        console.log("🗑️  Old questions deleted");

        // Naye insert karo
        await Question.insertMany([...striverQuestions, ...dailyQuestions]);
        console.log(`✅ Seeded ${striverQuestions.length + dailyQuestions.length} questions successfully!`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
        process.exit(1);
    }
};

seedDB();
