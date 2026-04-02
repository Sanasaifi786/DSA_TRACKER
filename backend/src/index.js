import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config({
    path: "./env"
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

