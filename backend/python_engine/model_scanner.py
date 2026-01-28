import os
import sys
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from crewai import Agent, Task, Crew, Process

# Configuration
API_KEY = "AIzaSyDdb43KOYTYenwSr0emSmxdQzZA4fo6idA"

# Candidate models to test
# We prioritize the latest stable and experimental builds that are likely to work
CANDIDATE_MODELS = [
    "gemini-2.0-flash-lite-preview-02-05", # Try the lite version first for speed/quota
    "gemini-flash-latest", # Alias for the latest stable flash
    "gemini-pro-latest",   # Alias for the latest stable pro
    "gemini-2.5-flash",    # Bleeding edge
    "gemini-2.0-flash"     # Keep as fallback, might be rate limited
]

WORKING_MODELS = []

# 1. Clean Environment
if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
    del os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

def test_model(model_name):
    print(f"\n🧪 TESTING MODEL: {model_name} ...")
    try:
        # Phase 1: Simple Hangshake
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=API_KEY,
            temperature=0.7,
            convert_system_message_to_human=True
        )
        msg = llm.invoke("Hello, are you online? Reply " + model_name)
        print(f"   ✅ Handshake Success: {msg.content}")
        
        # Phase 2: CrewAI Integration Test
        # Only run this if handshake succeeds
        test_agent = Agent(
            role='TestBot',
            goal='Confirm system integrity.',
            backstory="You are a simple test bot.",
            llm=llm,
            verbose=False,
            memory=False
        )
        task = Task(
            description=f"Say 'CrewAI + {model_name} is operational'.",
            expected_output="Confirmation message.",
            agent=test_agent
        )
        crew = Crew(agents=[test_agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        print(f"   🚀 CrewAI Success: {result}")
        
        return True
    except Exception as e:
        print(f"   ❌ FAILURE: {str(e)[:200]}...") # Print first 200 chars of error
        return False

# Main Loop
print("Starting Comprehensive Model Scan...")
print("------------------------------------")

for model in CANDIDATE_MODELS:
    if test_model(model):
        WORKING_MODELS.append(model)
    # Be polite to the API rate limiter
    time.sleep(2)

print("\n\n############################################")
print("🎉 SCAN COMPLETE. WORKING MODELS FOUND:")
print("############################################")
if WORKING_MODELS:
    for m in WORKING_MODELS:
        print(f"  ✅ {m}")
else:
    print("  ❌ NO WORKING MODELS FOUND.")
print("############################################")
