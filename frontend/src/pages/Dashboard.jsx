import React, { useState } from 'react';
import Header from '../components/Header';
import Orb from '../components/Orb';
import { Mic, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../lib/axios';

const Dashboard = () => {
    const [inputState, setInputState] = useState('idle'); // idle, listening, processing
    const [inputText, setInputText] = useState('');
    const [interaction, setInteraction] = useState(null); // { query: "...", response: "..." }

    const { user } = useAuth(); // Assuming Dashboard is protected and has access to user

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setInputState('processing');
        const currentQuery = inputText;
        setInteraction({ query: currentQuery, response: null });
        setInputText('');

        try {
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axiosInstance.post('/command', { prompt: currentQuery }, config);

            setInteraction(prev => ({
                ...prev,
                response: data.response
            }));
        } catch (error) {
            console.error("Neural Core Error:", error);
            setInteraction(prev => ({
                ...prev,
                response: "My apologies, Sir. It seems I've encountered a connection error with the Mainframe. I'll need a moment to recalibrate."
            }));
        } finally {
            setInputState('idle');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10"></div>

            <Header />

            {/* Main Content Area */}
            <main className="flex flex-col items-center gap-12 z-10 w-full max-w-2xl px-4">

                {/* The Oracle */}
                <div className="mb-8">
                    <Orb state={inputState} />
                </div>

                {/* Interaction Display (Single Thread) */}
                {interaction && (
                    <div className="w-full glass-panel p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                        <div className="mb-4">
                            <span className="text-xs text-blue-400 font-mono uppercase tracking-wider">User Command</span>
                            <p className="text-lg text-white font-light">{interaction.query}</p>
                        </div>
                        {interaction.response && (
                            <div className="border-t border-white/10 pt-4">
                                <span className="text-xs text-green-400 font-mono uppercase tracking-wider">ENVIS Response</span>
                                <p className="text-md text-blue-100 mt-1">{interaction.response}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Input Area (Only visible if not processing/or always visible?) */}
                <form onSubmit={handleSend} className="w-full relative group">
                    <input
                        type="text"
                        placeholder="Command ENVIS..."
                        className="w-full bg-gray-900/50 border border-white/10 rounded-full py-4 px-6 text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />

                    <div className="absolute right-2 top-2 flex items-center gap-2">
                        <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <Mic className="w-5 h-5" />
                        </button>
                        <button type="submit" className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default Dashboard;
