import os
import subprocess
import json
import psutil
import pyautogui
from crewai.tools import tool
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    pass

MEMORY_FILE = os.path.join(os.path.dirname(__file__), 'user_memory.json')

# --- LEVEL 1 & 2: BASIC & MEDIUM ---

@tool("python_interpreter")
def python_interpreter(code: str):
    """Executes python code. Use for math, logic, scripts. Returns STDOUT/STDERR."""
    try:
        result = subprocess.run(['python', '-c', code], capture_output=True, text=True, timeout=60)
        return f"STDOUT: {result.stdout}\nSTDERR: {result.stderr}"
    except Exception as e:
        return f"Execution Error: {str(e)}"

@tool("file_manager")
def file_manager(action: str, path: str, content: str = "", destination: str = ""):
    """Actions: read, write, append, delete, move, list. Path: Absolute or relative."""
    try:
        if action == 'read':
            with open(path, 'r') as f: return f.read()
        elif action == 'write':
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w') as f: f.write(content)
            return f"Written to {path}"
        elif action == 'delete':
            if os.path.exists(path):
                if os.path.isdir(path): os.removedirs(path)
                else: os.remove(path)
                return f"Deleted {path}"
            return "File not found."
        elif action == 'move':
            os.rename(path, destination)
            return f"Moved {path} to {destination}"
        elif action == 'list':
            return str(os.listdir(path))
        return "Invalid action."
    except Exception as e:
        return f"File Error: {str(e)}"

# --- LEVEL 3: HARD (BROWSER & SYSTEM) ---

@tool("browser_automation")
def browser_automation(url: str, action: str = "scrape", selector: str = "body"):
    """Automates browser. Actions: 'scrape' (returns text), 'screenshot', 'search'. url: The website."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url)
            if action == "scrape":
                content = page.inner_text(selector)
                browser.close()
                return content
            elif action == "search":
                page.goto(f"https://www.google.com/search?q={url}")
                content = page.inner_text("body")
                browser.close()
                return content
            browser.close()
            return "Action performed."
    except Exception as e:
        return f"Browser Error: {str(e)}"

@tool("desktop_control")
def desktop_control(action: str, detail: str = ""):
    """Native OS control. Actions: 'press' (key e.g. 'volumedown'), 'type' (text), 'click' (x,y)."""
    try:
        if action == 'press':
            pyautogui.press(detail)
            return f"Pressed key {detail}"
        elif action == 'type':
            pyautogui.write(detail, interval=0.1)
            return f"Typed {detail}"
        elif action == 'click':
            x, y = map(int, detail.split(','))
            pyautogui.click(x, y)
            return f"Clicked at {x},{y}"
        return "Invalid action."
    except Exception as e:
        return f"OS Control Error: {str(e)}"

# --- LEVEL 4: GEEK (PROCESSES & MEMORY) ---

@tool("process_manager")
def process_manager(action: str, name: str = ""):
    """Actions: 'list', 'kill'. name: Process name to kill."""
    try:
        if action == 'list':
            procs = [{"pid": p.info['pid'], "name": p.info['name']} for p in psutil.process_iter(['pid', 'name'])][:30]
            return str(procs)
        elif action == 'kill':
            for proc in psutil.process_iter(['name']):
                if proc.info['name'] == name:
                    proc.kill()
                    return f"Killed {name}"
            return f"Process {name} not found."
        return "Invalid action."
    except Exception as e:
        return f"Process Error: {str(e)}"

@tool("personality_memory")
def personality_memory(action: str, key: str = "", value: str = ""):
    """Reads/Writes user preferences, jokes, or traits. Actions: 'get', 'set', 'list'."""
    try:
        if not os.path.exists(MEMORY_FILE):
            with open(MEMORY_FILE, 'w') as f: json.dump({"user_details":{}}, f)
            
        with open(MEMORY_FILE, 'r+') as f:
            data = json.load(f)
            if action == 'get':
                return str(data.get('user_details', {}).get(key, "I don't recall that yet, Sir."))
            elif action == 'set':
                data['user_details'][key] = value
                f.seek(0)
                json.dump(data, f, indent=4)
                f.truncate()
                return f"Memorized {key} = {value}"
            elif action == 'list':
                return str(data['user_details'])
        return "Invalid action."
    except Exception as e:
        return f"Memory Error: {str(e)}"
