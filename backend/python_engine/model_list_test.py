import os
import google.generativeai as genai

API_KEY = "AIzaSyAG8v4UUN6Tvt9vKMyKRPUfggDlddKWXjw"

genai.configure(api_key=API_KEY)

print("Listing available models for this API Key...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"AVAILABLE MODEL: {m.name}")
except Exception as e:
    print("FAILED TO LIST MODELS")
    print(e)
