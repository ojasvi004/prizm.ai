"""
A2A Server wrapper for the Orchestrator agent.
Exposes the agent via Agent-to-Agent protocol.
"""

from google.adk.a2a import run_a2a_server
from .agent import root_agent
import os


def main():
    """
    Start the A2A server for the Orchestrator agent.
    """
    port = int(os.getenv("ORCHESTRATOR_PORT", "8000"))
    
    print(f"🎭 Starting Orchestrator A2A Server on port {port}")
    print(f"Agent: {root_agent.name}")
    print(f"Description: {root_agent.description}")
    
    run_a2a_server(
        agent=root_agent,
        port=port,
        host="0.0.0.0"
    )


if __name__ == "__main__":
    main()

