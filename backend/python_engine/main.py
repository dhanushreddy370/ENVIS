import sys
import os
from brain import EnvisBrain

def main():
    # FORCED OVERRIDE for User Session (Google Gemini)
    provider = "google" 
    model = "gemini-1.5-flash" 
    # Forcing API Key as well to ensure it picks up the correct one
    api_key = "AIzaSyAG8v4UUN6Tvt9vKMyKRPUfggDlddKWXjw"
    user_name = os.getenv("ENVIS_USER_NAME", "User")

    if not api_key:
        print("ERROR: API Key is missing. Please configure it in settings.")
        return

    # Initialize Brain
    brain = EnvisBrain(provider, model, api_key, user_name)

    # We read once from stdin for the command
    # In a real continuous scenario, this could be a loop
    try:
        input_data = sys.stdin.read().strip()
        if not input_data:
            return

        # Execute
        # print("DEBUG: Kicking off crew...") 
        result = brain.execute_command(input_data)
        
        # CrewAI 0.28+ returns a CrewOutput object. We convert it to a string for the frontend.
        print(str(result))

    except Exception as e:
        # Print to stderr for backend logging and exit with failure code
        sys.stderr.write(f"CRITICAL CORE ERROR: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
