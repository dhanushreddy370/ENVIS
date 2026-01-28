import os
import sys
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

# Configuration
API_KEY = "AIzaSyAG8v4UUN6Tvt9vKMyKRPUfggDlddKWXjw"

# 1. Clean Environment to prevent signal interference
# We strip standard Google env vars that might trigger Vertex AI auto-discovery
if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
    del os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

# 2. Test Raw LangChain First (Isolation Test)
print("--- PHASE 1: Raw LangChain Connection Test ---")
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    
    # Use standard model name 'gemini-2.0-flash-exp' which is available for this user
    # (The user has access to bleeding edge models like 2.5 and 3.0!)
    test_llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=API_KEY,
        temperature=0.7,
        # Potentially safer to convert system messages for older models, though 1.5 is fine
        convert_system_message_to_human=True 
    )
    
    msg = test_llm.invoke("Are you online?")
    print("Raw LangChain Success! Response:", msg.content)
    
except Exception as e:
    print("Raw LangChain Failed!")
    print(e)
    # If this fails, no point running CrewAI
    sys.exit(1)

# 3. Define the Agent
print("\n--- PHASE 2: CrewAI Agent Test ---")
# We reuse the working LLM object
jarvis_lite = Agent(
    role='Prototype AI',
    goal='Prove that you can speak to Google Gemini successfully.',
    backstory="You are a test unit. Your only job is to confirm you are online and maintaining character.",
    llm=test_llm,
    verbose=True,
    memory=False,
    allow_delegation=False
)

# 4. Define the Task
task = Task(
    description="Introduce yourself and tell me a one-line joke about programming.",
    expected_output="A short introduction and a joke.",
    agent=jarvis_lite
)

# 5. Run the Crew
crew = Crew(
    agents=[jarvis_lite],
    tasks=[task],
    process=Process.sequential,
    verbose=True
)

print("Starting CrewAI Execution...")
try:
    result = crew.kickoff()
    print("\n\n########################")
    print("SUCCESS! AGENT RESPONSE:")
    print("########################\n")
    print(result)
except Exception as e:
    print("\n\n########################")
    print("CREWAI FAILURE! ERROR LOG:")
    print("########################\n")
    print(e)
    import traceback
    traceback.print_exc()
