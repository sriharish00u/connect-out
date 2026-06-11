import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { activitiesRouter } from "./routes/activities.js";
import { authRouter } from "./routes/auth.js";
import { validateEnv } from "./config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../secret/.env") });

validateEnv();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/activities", activitiesRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
