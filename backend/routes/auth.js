import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { findUserByUsername, findUserById, createUser, updateUser } from "../lib/fileDb.js";
import bcrypt from "bcryptjs";

const router = express.Router();
const USE_MOCK = process.env.USE_MOCK_DB === 'true';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod", {
        expiresIn: "30d",
    });
};

// --- HELPERS FOR HYBRID MODE ---
const getUser = async (username) => {
    if (USE_MOCK) return findUserByUsername(username);
    return await User.findOne({ username });
};

const getUserById = async (id) => {
    if (USE_MOCK) return findUserById(id);
    return await User.findById(id);
};

const createNewUser = async (data) => {
    if (USE_MOCK) {
        // Manually hash password for mock mode
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        return await createUser({ ...data, password: hashedPassword });
    }
    return await User.create(data);
};

// --- ROUTES ---

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
    const { username, password, settings } = req.body;
    console.log(`[REGISTER] Mode: ${USE_MOCK ? 'LOCAL MOCK' : 'MONGO CLOUD'} | User: ${username}`);

    try {
        const userExists = await getUser(username);
        if (userExists) {
            console.log(`[REGISTER] User ${username} already exists`);
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await createNewUser({ username, password, settings });

        if (user) {
            console.log(`[REGISTER] User ${username} created successfully`);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                settings: user.settings,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error(`[REGISTER] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUser(username);
        if (!user) {
            return res.status(404).json({ message: "User does not exist. Please sign up." });
        }

        // Compare password (works for both Mongoose doc and Mock obj if we use bcrypt directly)
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                _id: user._id,
                username: user.username,
                settings: user.settings,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid password. Access denied." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/profile
router.put("/profile", async (req, res) => {
    // Need middleware to extract user from token first. 
    // For now, let's assume req.body.username or extract ID from a header manually if middleware not set globally
    // Actually, let's do simple token verify here for speed or assume authMiddleware is applied.
    // I'll create a simple inline middleware for now or skip auth for MVP? No, let's use the ID.

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod");

        if (USE_MOCK) {
            const updated = updateUser(decoded.id, { settings: req.body.settings });
            if (updated) return res.json({ _id: updated._id, username: updated.username, settings: updated.settings });
            return res.status(404).json({ message: "User not found" });
        } else {
            const user = await User.findById(decoded.id);
            if (user) {
                user.settings = req.body.settings || user.settings;
                if (req.body.password) user.password = req.body.password;

                const updatedUser = await user.save();
                res.json(updatedUser.toProfile());
            } else {
                res.status(404).json({ message: "User not found" });
            }
        }
    } catch (error) {
        res.status(401).json({ message: "Token failed" });
    }
});

export default router;
