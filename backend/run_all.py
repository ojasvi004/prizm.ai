"""
Startup script to run all Prizm AI agents.
Starts all 6 agents on their respective ports.
"""

import subprocess
import sys
import time
from typing import List
import os


AGENTS = [
    {"name": "Orchestrator", "module": "orchestrator.main", "port": 8000, "emoji": "🎭"},
    {"name": "Analyst", "module": "analyst.main", "port": 8001, "emoji": "🔍"},
    {"name": "Protagonist", "module": "debaters.protagonist.main", "port": 8002, "emoji": "✅"},
    {"name": "Antagonist", "module": "debaters.antagonist.main", "port": 8003, "emoji": "❌"},
    {"name": "Verifier", "module": "verifier.main", "port": 8004, "emoji": "✔️"},
    {"name": "Synthesizer", "module": "synthesizer.main", "port": 8005, "emoji": "🧠"},
]


def start_agent(agent_info: dict) -> subprocess.Popen:
    """Start a single agent process."""
    print(f"{agent_info['emoji']} Starting {agent_info['name']} on port {agent_info['port']}...")
    
    env = os.environ.copy()
    port_var = f"{agent_info['name'].upper()}_PORT"
    env[port_var] = str(agent_info['port'])
    
    process = subprocess.Popen(
        [sys.executable, "-m", agent_info['module']],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )
    
    return process


def main():
    """Start all agents."""
    print("=" * 60)
    print("🚀 Starting Prizm AI Multi-Agent System")
    print("=" * 60)
    print()
    
    processes: List[subprocess.Popen] = []
    
    try:
        # Start all agents
        for agent_info in AGENTS:
            process = start_agent(agent_info)
            processes.append(process)
            time.sleep(1)  # Stagger startup
        
        print()
        print("=" * 60)
        print("✨ All agents started successfully!")
        print("=" * 60)
        print()
        print("Agent endpoints:")
        for agent_info in AGENTS:
            print(f"  {agent_info['emoji']} {agent_info['name']:15} → http://localhost:{agent_info['port']}")
        print()
        print("Press Ctrl+C to stop all agents")
        print("=" * 60)
        
        # Wait for all processes
        while True:
            time.sleep(1)
            
            # Check if any process died
            for i, process in enumerate(processes):
                if process.poll() is not None:
                    print(f"⚠️  {AGENTS[i]['name']} stopped unexpectedly")
                    # Could restart here if desired
    
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down all agents...")
        
        # Terminate all processes
        for i, process in enumerate(processes):
            print(f"  Stopping {AGENTS[i]['name']}...")
            process.terminate()
        
        # Wait for graceful shutdown
        time.sleep(2)
        
        # Force kill if needed
        for process in processes:
            if process.poll() is None:
                process.kill()
        
        print("✅ All agents stopped")
        print()


if __name__ == "__main__":
    main()
