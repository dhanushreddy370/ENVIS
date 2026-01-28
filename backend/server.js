import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Database Connection
connectDB();

// Routes
import authRoutes from "./routes/auth.js";
import commandRoutes from "./routes/command.js";
app.use("/api/auth", authRoutes);
app.use("/api/command", commandRoutes);

// Basic Route
app.get("/", (req, res) => {
    res.send("ENVIS v2 Backend Operational");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
