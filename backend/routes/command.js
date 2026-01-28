import express from 'express';
import { spawn } from 'child_process';
import { protect } from '../middleware/authMiddleware.js';
import path from 'path';

const router = express.Router();

// USER'S PYTHON INTERPRETER PATH (Stable 3.12)
const PYTHON_PATH = "c:\\Users\\dhanu\\OneDrive\\Desktop\\Trading_algorithm\\Projects\\.venv\\Scripts\\python.exe";

router.post('/', protect, async (req, res) => {
    const { prompt } = req.body;

    // User settings
    const { llmProvider = 'openai', modelName = 'gpt-4o', apiKey = '' } = req.user.settings || {};
    const userName = req.user.username;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        const scriptPath = path.join(process.cwd(), 'python_engine', 'main.py');

        console.log(`[CORE] Spawning AI Agent for ${userName}...`);

        const pythonProcess = spawn(PYTHON_PATH, ['-u', scriptPath], {
            env: {
                ...process.env,
                ENVIS_PROVIDER: llmProvider,
                ENVIS_MODEL: modelName,
                ENVIS_API_KEY: apiKey,
                ENVIS_USER_NAME: userName
            }
        });

        let outputData = "";
        let errorData = "";

        pythonProcess.stdin.write(prompt);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            const errChunk = data.toString();
            errorData += errChunk;
            // Always stream agent logs to backend console for analysis
            process.stderr.write(`[AGENT LOG] ${errChunk}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`[CORE] AI Process Terminated. Code: ${code}. Check terminal for [AGENT LOG].`);
                return res.status(500).json({
                    message: "My apologies, Sir. It seems I've encountered a neural desync with the Mainframe. I'll need a moment to recalibrate."
                });
            }

            res.json({ response: outputData.trim() || "No response generated." });
        });

    } catch (error) {
        console.error("[CORE] Command Route Error:", error);
        res.status(500).json({ message: 'Neural Core Initialization Failure' });
    }
});

export default router;
