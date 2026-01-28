import React from 'react';
import { motion } from 'framer-motion';

const Orb = ({ state = 'idle' }) => {
    // state: 'idle', 'listening', 'processing', 'speaking'

    const variants = {
        idle: {
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
            filter: "hue-rotate(0deg)",
            transition: { duration: 4, repeat: Infinity }
        },
        listening: {
            scale: [1, 1.2, 1],
            opacity: 1,
            filter: "hue-rotate(90deg) drop-shadow(0 0 20px #ffcc00)", // Gold/Orange for listening
            transition: { duration: 1.5, repeat: Infinity }
        },
        processing: {
            rotate: 360,
            scale: [1, 0.8, 1],
            filter: "hue-rotate(180deg) drop-shadow(0 0 30px #00ffff)", // Cyan fast spin
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
        }
    };

    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Core Orb */}
            <motion.div
                className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-md shadow-2xl"
                animate={state}
                variants={variants}
            />

            {/* Outer Ring 1 */}
            <motion.div
                className="absolute w-56 h-56 border border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Outer Ring 2 (Counter-rotate) */}
            <motion.div
                className="absolute w-64 h-64 border border-blue-500/30 rounded-full border-dashed"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default Orb;
