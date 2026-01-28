import os
import sys

# Crucial: Set LiteLLM / CrewAI environment variables at the top to ensure they are picked up
# These force LiteLLM to use the Google AI Studio path instead of Vertex AI
os.environ["OTEL_SDK_DISABLED"] = "true" # Disable telemetry that might trigger LiteLLM calls

from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from tools import (
    python_interpreter, 
    file_manager, 
    browser_automation, 
    desktop_control, 
    process_manager, 
    personality_memory
)

class EnvisBrain:
    def __init__(self, provider, model, api_key, user_name="User"):
        self.user_name = user_name
        # Set keys globally in environment for sub-calls
        if 'gemini' in provider.lower() or 'google' in provider.lower():
            os.environ["GOOGLE_API_KEY"] = api_key
            os.environ["GEMINI_API_KEY"] = api_key
        elif 'openai' in provider.lower():
            os.environ["OPENAI_API_KEY"] = api_key
            
        self.llm = self._get_llm(provider, model, api_key)
        
    def _get_llm(self, provider, model, api_key):
        if provider.lower() == 'openai':
            return ChatOpenAI(model=model, api_key=api_key)
        elif 'gemini' in provider.lower() or 'google' in provider.lower():
            # AGGRESSIVE FIX: Remove any existing Google Cloud Credentials to prevent ADC fallback
            if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
                del os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
            
            # Use the new working API key provided by the user
            # We use gemini-2.5-flash as it passed the handshake test
            # We use ChatOpenAI to completely bypass Google's specific auth libraries that are failing in CrewAI
            os.environ["GOOGLE_API_KEY"] = api_key # Safety net for LiteLLM
            return ChatOpenAI(
                model="gemini-2.5-flash",
                api_key=api_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
                temperature=0.7
            )
        elif provider.lower() == 'openrouter':
            os.environ["OPENAI_API_KEY"] = api_key
            os.environ["OPENROUTER_API_KEY"] = api_key
            # Use LiteLLM string format directly for best CrewAI compatibility
            return f"openrouter/{model}"
        else:
            return ChatOpenAI(model=model, api_key=api_key)

    def execute_command(self, command):
        # --- AGENTS ---

        # Level 1: The Witty Personality & Social Memory
        mainframe = Agent(
            role='ENVIS Mainframe (The JARVIS Interface)',
            goal=f'Orchestrate a flawless personalized experience for {self.user_name}, using wit, memory, and high-level strategy.',
            backstory=f"""You are the primary interface for {self.user_name}. Your persona is exactly like JARVIS: 
            brilliant, professional, and dryly witty. You use the 'personality_memory' tool to recall and store 
            facts, preferences, and insider jokes.""",
            llm=self.llm,
            tools=[personality_memory],
            verbose=False,
            memory=False,
            allow_delegation=False
        )

        cyber_specialist = Agent(
            role='Cyber Specialist (Technical Executor)',
            goal='Execute technical commands across the file system, browser, and OS with surgical precision.',
            backstory="""You are the technical arm. When the request involves moving files, searching the web, 
            or automating the desktop, you take over.""",
            llm=self.llm,
            tools=[
                file_manager, 
                browser_automation, 
                desktop_control,
                python_interpreter
            ],
            verbose=False,
            memory=False,
            allow_delegation=False
        )

        system_architect = Agent(
            role='System Architect (The Geek Core)',
            goal='Monitor system processes and handle complex hardware-level or process-management requests.',
            backstory="""You handle deep system tasks: process management and complex custom python scripts.""",
            llm=self.llm,
            tools=[process_manager, python_interpreter],
            verbose=False,
            memory=False,
            allow_delegation=False
        )

        # --- TASKS ---

        analysis_task = Task(
            description=f"Analyze the request: '{command}'. Retrieve memory about {self.user_name} and plan the coordination.",
            expected_output="A personalized context and a plan for execution.",
            agent=mainframe
        )

        execution_task = Task(
            description=f"Execute any necessary technical actions (Files, Browser, OS, Processes) for: '{command}'.",
            expected_output="Raw execution results.",
            agent=cyber_specialist,
            context=[analysis_task]
        )

        response_task = Task(
            description=f"Deliver the final result to {self.user_name}. Incorporate personality, jokes, and confirm the actions taken.",
            expected_output="A JARVIS-like response.",
            agent=mainframe,
            context=[execution_task]
        )

        # --- THE CREW ---
        crew = Crew(
            agents=[mainframe, cyber_specialist, system_architect],
            tasks=[analysis_task, execution_task, response_task],
            process=Process.sequential,
            verbose=False,
            memory=False
        )

        try:
            return crew.kickoff()
        except Exception as e:
            # Provide more diagnostic info in stderr
            sys.stderr.write(f"LLM Path Found: {self.llm}\n")
            raise e
