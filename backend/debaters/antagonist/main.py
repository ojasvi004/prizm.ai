"""
A2A Server wrapper for the Antagonist agent.
Exposes the agent via Agent-to-Agent protocol.
"""

from google.adk.a2a import run_a2a_server
from .agent import root_agent
import os


def main():
    """
    Start the A2A server for the Antagonist agent.
    """
    port = int(os.getenv("ANTAGONIST_PORT", "8003"))
    
    print(f"❌ Starting Antagonist A2A Server on port {port}")
    print(f"Agent: {root_agent.name}")
    print(f"Description: {root_agent.description}")
    
    run_a2a_server(
        agent=root_agent,
        port=port,
        host="0.0.0.0"
    )


if __name__ == "__main__":
    main()