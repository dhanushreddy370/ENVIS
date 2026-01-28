import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

import { LLM_PROVIDERS } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, updateProfile, logout } = useAuth();

    const initialProvider = user?.settings?.llmProvider || 'openai';
    const isKnownProvider = Object.keys(LLM_PROVIDERS).includes(initialProvider);
    const initialModel = user?.settings?.modelName || '';
    // If provider is known, check if model is in the list. If not, treat as custom.
    const isKnownModel = isKnownProvider && LLM_PROVIDERS[initialProvider]?.models.includes(initialModel);

    const [settings, setSettings] = useState({
        username: user?.username || '',
        llmProvider: isKnownProvider ? initialProvider : 'other',
        customProvider: isKnownProvider ? '' : initialProvider,
        // If it's a known provider but unknown model -> 'other'
        modelSelect: isKnownProvider ? (isKnownModel ? initialModel : 'other') : 'other',
        customModelName: (!isKnownModel) ? initialModel : '',
        apiKey: user?.settings?.apiKey || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => {
            const newSettings = { ...prev, [name]: value };

            // Provider switching logic
            if (name === 'llmProvider') {
                if (value !== 'other') {
                    newSettings.customProvider = '';
                    // Reset model selection when provider changes
                    // Default to first model, or 'other' if we prefer
                    const firstModel = LLM_PROVIDERS[value]?.models[0];
                    newSettings.modelSelect = firstModel || 'other';
                    newSettings.customModelName = '';
                } else {
                    newSettings.modelSelect = 'other';
                    newSettings.customModelName = '';
                }
            }
            return newSettings;
        });
    };

    const handleSave = () => {
        const finalProvider = settings.llmProvider === 'other' ? settings.customProvider : settings.llmProvider;
        const finalModel = settings.modelSelect === 'other' ? settings.customModelName : settings.modelSelect;

        updateProfile({
            llmProvider: finalProvider,
            modelName: finalModel,
            apiKey: settings.apiKey
        });
    };

    const currentModels = settings.llmProvider !== 'other' ? LLM_PROVIDERS[settings.llmProvider]?.models : [];

    return (
        <div className="min-h-screen bg-black text-white p-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header Section (Unchanged) */}
            <div className="max-w-3xl mx-auto flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-light tracking-tight">System Configuration</h1>
                </div>
                <button
                    onClick={handleSave}
                    className="btn btn-sm btn-ghost text-blue-400 hover:text-blue-300 gap-2 border border-blue-500/30 px-4 rounded-full transition-all hover:bg-blue-500/10"
                >
                    <Save className="w-4 h-4" />
                    Commit Changes
                </button>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Profile Section (Unchanged) */}
                <section className="glass-panel p-8 rounded-2xl">
                    <h2 className="text-xl font-mono text-blue-400 mb-6 uppercase tracking-wider">Identity</h2>
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label text-sm text-gray-400">User Designation (Name)</label>
                            <input
                                type="text"
                                name="username"
                                value={settings.username}
                                onChange={handleChange}
                                className="input input-bordered bg-black/50 border-white/10 focus:border-blue-500 text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Brain Section */}
                <section className="glass-panel p-8 rounded-2xl">
                    <h2 className="text-xl font-mono text-purple-400 mb-6 uppercase tracking-wider">Core Intelligence</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Provider Select */}
                        <div className="form-control">
                            <label className="label text-sm text-gray-400">Provider</label>
                            <select
                                name="llmProvider"
                                value={settings.llmProvider}
                                onChange={handleChange}
                                className="select select-bordered bg-black/50 border-white/10 text-white"
                            >
                                {Object.entries(LLM_PROVIDERS).map(([key, provider]) => (
                                    <option key={key} value={key}>{provider.label}</option>
                                ))}
                                <option value="other">Other / Custom</option>
                            </select>
                        </div>

                        {/* Custom Provider Name Input (Visible only if 'other' is selected) */}
                        {settings.llmProvider === 'other' && (
                            <div className="form-control animate-in fade-in slide-in-from-top-2">
                                <label className="label text-sm text-gray-400">Custom Provider Name</label>
                                <input
                                    type="text"
                                    name="customProvider"
                                    placeholder="e.g. Local Ollama"
                                    value={settings.customProvider}
                                    onChange={handleChange}
                                    className="input input-bordered bg-black/50 border-white/10 text-white"
                                />
                            </div>
                        )}

                        {/* Model Selection */}
                        <div className="form-control md:col-span-2">
                            <label className="label text-sm text-gray-400">Model ID</label>
                            {settings.llmProvider !== 'other' ? (
                                <>
                                    <select
                                        name="modelSelect"
                                        value={settings.modelSelect}
                                        onChange={handleChange}
                                        className="select select-bordered bg-black/50 border-white/10 text-white w-full"
                                    >
                                        {currentModels?.map((model) => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                        <option value="other">Other / Custom</option>
                                    </select>

                                    {settings.modelSelect === 'other' && (
                                        <input
                                            type="text"
                                            name="customModelName"
                                            placeholder="e.g. gpt-4-32k-0314"
                                            value={settings.customModelName}
                                            onChange={handleChange}
                                            className="input input-bordered bg-black/50 border-white/10 text-white w-full mt-2 animate-in fade-in"
                                        />
                                    )}
                                </>
                            ) : (
                                <input
                                    type="text"
                                    name="customModelName" // Use customModelName here as well for consistency if provider is other
                                    placeholder="e.g. llama3:8b"
                                    value={settings.customModelName}
                                    onChange={handleChange}
                                    className="input input-bordered bg-black/50 border-white/10 text-white"
                                />
                            )}
                        </div>

                        {/* API Key */}
                        <div className="form-control md:col-span-2">
                            <label className="label text-sm text-gray-400">API Key</label>
                            <input
                                type="password"
                                name="apiKey"
                                value={settings.apiKey}
                                onChange={handleChange}
                                className="input input-bordered bg-black/50 border-white/10 text-white font-mono"
                            />
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="glass-panel p-8 rounded-2xl border border-red-900/30">
                    <h2 className="text-xl font-mono text-red-400 mb-6 uppercase tracking-wider">Danger Zone</h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white">Terminate Session</p>
                            <p className="text-sm text-gray-500">Log out of the current device.</p>
                        </div>
                        <button className="btn btn-outline btn-error uppercase tracking-widest text-xs" onClick={logout}>
                            System Logout
                        </button>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button className="btn btn-primary bg-blue-600 hover:bg-blue-500 border-none px-8 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Configuration
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
