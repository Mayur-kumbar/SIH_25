import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.static("public"));

app.use(cookieParser());

import authRoutes from "./routes/auth.route.js"
import activityRoutes from "./routes/activity.route.js"
import userRoutes from "./routes/user.route.js"

app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes)
app.use("/api/user", userRoutes);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


export { app };
