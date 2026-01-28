import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LLM_PROVIDERS } from '../lib/constants';

const Auth = ({ isLogin = true }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        llmProvider: 'openai',
        customProvider: '',
        modelName: '',
        apiKey: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'llmProvider' && value !== 'other') {
                newData.customProvider = '';
                newData.modelName = LLM_PROVIDERS[value].models[0];
            }
            return newData;
        });
    };

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let success = false;
        if (isLogin) {
            success = await login(formData.username, formData.password);
        } else {
            // Determine final provider and model
            const finalProvider = formData.llmProvider === 'other' ? formData.customProvider : formData.llmProvider;
            const finalModel = formData.modelName === 'other' ? formData.customModelName : formData.modelName;

            const registrationData = {
                username: formData.username,
                password: formData.password,
                settings: {
                    llmProvider: finalProvider,
                    modelName: finalModel,
                    apiKey: formData.apiKey
                }
            };
            success = await register(registrationData);
        }

        if (success) {
            navigate('/');
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const currentModels = formData.llmProvider !== 'other' ? LLM_PROVIDERS[formData.llmProvider]?.models : [];

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg glass-panel p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-[0.2em] text-white mb-2">ENVIS</h1>
                    <p className="text-blue-400 text-xs uppercase tracking-widest">
                        {isLogin ? 'System Access' : 'Initialize New Protocol'}
                    </p>
                </div>

                <form onSubmit={isLogin || step === 2 ? handleSubmit : handleNext} className="space-y-6">

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="form-control">
                                    <label className="label text-xs uppercase text-gray-500">Identity</label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs uppercase text-gray-500">Passcode</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                        onChange={handleChange}
                                    />
                                </div>
                                {!isLogin && (
                                    <div className="form-control">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Passcode"
                                            className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && !isLogin && (
                            <motion.div
                                key="step2"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-4"
                            >
                                <div className="form-control">
                                    <label className="label text-xs uppercase text-blue-400">Intelligence Configuration</label>
                                    <select
                                        name="llmProvider"
                                        className="select select-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                        onChange={handleChange}
                                        value={formData.llmProvider}
                                    >
                                        {Object.entries(LLM_PROVIDERS).map(([key, provider]) => (
                                            <option key={key} value={key}>{provider.label}</option>
                                        ))}
                                        <option value="other">Other / Custom</option>
                                    </select>
                                </div>

                                {formData.llmProvider === 'other' && (
                                    <div className="form-control animate-in fade-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            name="customProvider"
                                            placeholder="Enter Provider Name"
                                            className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                <div className="form-control">
                                    {formData.llmProvider !== 'other' ? (
                                        <>
                                            <select
                                                name="modelName"
                                                value={formData.modelName}
                                                onChange={handleChange}
                                                className="select select-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                            >
                                                <option value="" disabled>Select Model</option>
                                                {currentModels?.map((model) => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                                <option value="other">Other / Custom</option>
                                            </select>
                                            {formData.modelName === 'other' && (
                                                <input
                                                    type="text"
                                                    name="customModelName"
                                                    placeholder="e.g. gpt-4-32k-0314"
                                                    className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full mt-2 animate-in fade-in"
                                                    onChange={(e) => setFormData(prev => ({ ...prev, customModelName: e.target.value }))}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <input
                                            type="text"
                                            name="modelName"
                                            placeholder="Model ID (e.g. gpt-4o)"
                                            className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full"
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>

                                <div className="form-control">
                                    <input
                                        type="password"
                                        name="apiKey"
                                        placeholder="API Key"
                                        className="input input-bordered bg-black/40 border-white/10 focus:border-blue-500 w-full font-mono"
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" className="btn btn-block bg-blue-600 hover:bg-blue-500 text-white border-0 uppercase tracking-widest text-xs relative overflow-hidden group">
                        <span className="relative z-10">{isLogin ? 'Authenticate' : (step === 1 ? 'Next Phase' : 'Initialize')}</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <div className="text-center text-xs text-gray-500 mt-4">
                        {isLogin ? (
                            <p>No clearance? <Link to="/signup" className="text-blue-400 hover:underline">Request access</Link></p>
                        ) : (
                            <p>Already authorized? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link></p>
                        )}
                    </div>

                </form>
            </motion.div>
        </div>
    );
};

export default Auth;
