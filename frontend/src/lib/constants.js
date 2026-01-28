export const LLM_PROVIDERS = {
    openai: {
        label: "OpenAI",
        models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]
    },
    gemini: {
        label: "Google Gemini",
        models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"]
    },
    anthropic: {
        label: "Anthropic",
        models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]
    },
    openrouter: {
        label: "OpenRouter",
        models: [
            "openai/gpt-4o",
            "google/gemini-pro-1.5",
            "anthropic/claude-3-opus",
            "meta-llama/llama-3-70b-instruct",
            "mistralai/mixtral-8x22b-instruct"
        ]
    }
};
