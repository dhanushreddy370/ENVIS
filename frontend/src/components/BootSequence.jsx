import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Orb from './Orb';

const BootSequence = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 1000), // Show Orb
            setTimeout(() => setPhase(2), 2500), // Show ENVIS
            setTimeout(() => setPhase(3), 4000), // Show Tagline
            setTimeout(() => onComplete(), 6000), // Finish
        ];
        return () => timers.forEach(t => clearTimeout(t));
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Grid/Scanning Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

            <AnimatePresence>
                {phase >= 1 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 5, opacity: 0 }}
                        className="mb-12"
                    >
                        <Orb state="processing" />
                    </motion.div>
                )}

                {phase >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2"
                    >
                        <h1 className="text-6xl font-bold tracking-[0.3em] text-white flex items-center justify-center">
                            {["E", "N", "V", "I", "S"].map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    {char}
                                    {i < 4 && <span className="text-blue-500">.</span>}
                                </motion.span>
                            ))}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-blue-400 text-xs uppercase tracking-[0.5em] font-light"
                        >
                            Enhanced Neural Virtual Intelligence System
                        </motion.p>
                    </motion.div>
                )}

                {phase >= 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-12"
                    >
                        <p className="text-gray-500 font-mono text-sm tracking-widest italic animate-pulse">
                            "See it, Say it, Done"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-20 h-[1px] bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
        </div>
    );
};

export default BootSequence;
