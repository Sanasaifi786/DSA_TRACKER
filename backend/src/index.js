import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./db/index.db.js";
import authRoutes from "./routes/auth.routes.js";
import questionsRoutes from "./routes/questions.routes.js";
import progressRoutes from "./routes/progress.routes.js";

dotenv.config({
    path: "./.env"
});

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/questions", questionsRoutes);
app.use("/api/v1/progress", progressRoutes);

// Pehle DB connect karo, phir server start karo
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    });


