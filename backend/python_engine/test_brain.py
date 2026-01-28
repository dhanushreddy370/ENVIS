from brain import EnvisBrain
import os
import sys

# Testing Direct Google Gemini
provider = "google"
model = "gemini-1.5-flash"
api_key = "AIzaSyAG8v4UUN6Tvt9vKMyKRPUfggDlddKWXjw"

print(f"Testing Brain with Provider: {provider}, Model: {model}")

try:
    brain = EnvisBrain(provider, model, api_key, "TestUser")
    result = brain.execute_command("Hello Direct Gemini, are you online?")
    print("--- RESULT ---")
    print(result)
    print("--- END RESULT ---")
except Exception as e:
    print(f"ERROR: {e}")
    # print full traceback to see where it fails (litellm or elsewhere)
    import traceback
    traceback.print_exc()
