# Prizm AI Backend

Multi-agent debate system using Google Agent Development Kit (ADK) and Agent-to-Agent (A2A) protocol.

## Architecture

Prizm AI consists of 6 specialized agents that collaborate to provide comprehensive multi-perspective analysis:

```
┌─────────────┐
│ Orchestrator│ - Coordinates the entire workflow
└──────┬──────┘
       │
       ├─> Analyst ────────> Identifies debate factors
       │
       ├─> Protagonist ────> Argues FOR each factor
       │
       ├─> Antagonist ────> Argues AGAINST each factor
       │
       ├─> Verifier ──────> Fact-checks all arguments
       │
       └─> Synthesizer ───> Creates final synthesis
```

## Agents

### 1. Orchestrator (Port 8000)
- **Role**: Workflow coordinator
- **Responsibilities**: Manages the debate lifecycle, routes messages between agents, tracks session state
- **Location**: `orchestrator/`

### 2. Analyst (Port 8001)
- **Role**: Factor identification
- **Responsibilities**: Analyzes topics and breaks them down into 3-7 key debate factors/dimensions
- **Location**: `analyst/`

### 3. Protagonist (Port 8002)
- **Role**: Supporting arguments
- **Responsibilities**: Develops strong arguments IN FAVOR of positions for each factor
- **Location**: `debaters/protagonist/`

### 4. Antagonist (Port 8003)
- **Role**: Opposing arguments
- **Responsibilities**: Develops strong arguments AGAINST positions for each factor
- **Location**: `debaters/antagonist/`

### 5. Verifier (Port 8004)
- **Role**: Fact-checking
- **Responsibilities**: Verifies argument accuracy, logic, and evidence quality
- **Tools**: `check_logical_consistency`, `verify_evidence`, `assess_confidence`
- **Location**: `verifier/`

### 6. Synthesizer (Port 8005)
- **Role**: Final synthesis
- **Responsibilities**: Creates comprehensive analysis from all arguments and verifications
- **Tools**: `identify_consensus`, `identify_divergence`, `calculate_overall_confidence`, `extract_key_insights`
- **Location**: `synthesizer/`

## Data Schemas

All agents use shared Pydantic schemas defined in `shared/schemas.py`:

- **DebateFactor**: Represents a dimension to be debated (e.g., cost, scalability)
- **Argument**: An argument from a debater with reasoning and evidence
- **VerificationResult**: Results from argument fact-checking
- **DebateSession**: Complete debate session tracking
- **SynthesisResult**: Final synthesis output

## Setup

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment** (optional):
```bash
cp .env.example .env
# Edit .env to set custom ports if needed
```

## Running the System

### Option 1: Run all agents individually

```bash
# Terminal 1 - Orchestrator
python -m orchestrator.main

# Terminal 2 - Analyst
python -m analyst.main

# Terminal 3 - Protagonist
python -m debaters.protagonist.main

# Terminal 4 - Antagonist
python -m debaters.antagonist.main

# Terminal 5 - Verifier
python -m verifier.main

# Terminal 6 - Synthesizer
python -m synthesizer.main
```

### Option 2: Use a process manager (recommended)

Create a `Procfile` or use a tool like `honcho`, `foreman`, or `docker-compose`.

## Usage Flow

1. **User** sends a topic/question to the **Orchestrator**
2. **Orchestrator** creates a session and sends topic to **Analyst**
3. **Analyst** identifies 3-7 debate factors and returns them
4. **Orchestrator** sends each factor to both **Protagonist** and **Antagonist**
5. **Protagonist** and **Antagonist** generate arguments for each factor
6. **Orchestrator** sends all arguments to **Verifier**
7. **Verifier** fact-checks and scores each argument
8. **Orchestrator** sends all arguments + verifications to **Synthesizer**
9. **Synthesizer** creates comprehensive final analysis
10. **Orchestrator** returns synthesis to user

## Example Workflow

```python
# Example topic
topic = "Should our company migrate to microservices?"

# Analyst output (example)
factors = [
    DebateFactor(name="Scalability", weight=0.9),
    DebateFactor(name="Development Complexity", weight=0.8),
    DebateFactor(name="Operational Overhead", weight=0.7),
]

# Protagonist argument (example)
argument_pro = Argument(
    factor_id="scalability",
    debater_role="protagonist",
    position="Microservices significantly improve scalability",
    reasoning="...",
    evidence=["Netflix scaled to 200M users", "40% cost reduction"],
    confidence=0.85
)

# Antagonist argument (example)
argument_con = Argument(
    factor_id="scalability",
    debater_role="antagonist",
    position="Microservices create scalability complexity",
    reasoning="...",
    evidence=["Distributed system challenges", "CAP theorem"],
    confidence=0.80
)

# Final synthesis includes both perspectives with recommendations
```

## Configuration

Environment variables:

```bash
ORCHESTRATOR_PORT=8000
ANALYST_PORT=8001
PROTAGONIST_PORT=8002
ANTAGONIST_PORT=8003
VERIFIER_PORT=8004
SYNTHESIZER_PORT=8005
```

## Development

### Adding new tools

1. Create tool functions in the appropriate `tools.py` file
2. Add tools to the agent's `tools` parameter in `agent.py`
3. Tools should follow ADK conventions (type-annotated Python functions)

### Extending agents

1. Modify the agent's `instruction` to add new behaviors
2. Add tools for new capabilities
3. Update schemas if new data contracts are needed

## A2A Protocol

All agents expose an A2A server that allows them to:
- Receive structured messages
- Process requests using ADK
- Return structured responses
- Support async communication

## Tech Stack

- **Google ADK**: Agent framework with LLM integration
- **A2A Protocol**: Agent-to-agent communication
- **Pydantic**: Data validation and schemas
- **FastAPI/Uvicorn**: HTTP server infrastructure (via ADK)
- **Gemini 2.5 Flash**: LLM model for all agents

## License

See LICENSE file in root directory.