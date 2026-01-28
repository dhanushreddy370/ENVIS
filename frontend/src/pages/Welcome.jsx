import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Orb from '../components/Orb';

const Welcome = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black -z-10"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-8 z-10"
            >
                <div className="mb-4 transform scale-150">
                    <Orb state="idle" />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-bold tracking-[0.2em] text-white">ENVIS</h1>
                    <p className="text-blue-400 text-sm uppercase tracking-widest">Enhanced Neural Virtual Intelligence System</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full max-w-md px-6">
                    <Link to="/login" className="flex-1">
                        <button className="btn btn-outline border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white w-full uppercase tracking-widest text-xs h-12 rounded-none clip-path-polygon">
                            Initialize Session
                        </button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                        <button className="btn bg-white text-black hover:bg-gray-200 border-none w-full uppercase tracking-widest text-xs h-12 rounded-none">
                            Create Protocol
                        </button>
                    </Link>
                </div>
            </motion.div>

            <div className="absolute bottom-8 text-center">
                <p className="text-gray-600 text-[10px] font-mono">SYSTEM V2.0 // ONLINE</p>
            </div>
        </div>
    );
};

export default Welcome;
