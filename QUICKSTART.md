# Prizm AI - Quick Start Guide

Welcome to Prizm AI! This guide will help you get started quickly.

## Installation

```bash
cd backend
pip install -r requirements.txt
```

Or using the pyproject.toml:

```bash
cd backend
pip install -e .
```

## Quick Start

### Option 1: Run all agents at once (Recommended)

```bash
cd backend
python run_all.py
```

This will start all 6 agents:
- 🎭 Orchestrator (port 8000)
- 🔍 Analyst (port 8001)
- ✅ Protagonist (port 8002)
- ❌ Antagonist (port 8003)
- ✔️ Verifier (port 8004)
- 🧠 Synthesizer (port 8005)

### Option 2: Run agents individually

```bash
# In separate terminal windows:
python -m orchestrator.main
python -m analyst.main
python -m debaters.protagonist.main
python -m debaters.antagonist.main
python -m verifier.main
python -m synthesizer.main
```

## How It Works

1. **Send a topic** to the Orchestrator
2. **Analyst** breaks it down into debate factors
3. **Protagonist** argues FOR each factor
4. **Antagonist** argues AGAINST each factor
5. **Verifier** fact-checks all arguments
6. **Synthesizer** creates comprehensive analysis

## Example Topic

"Should we migrate our application to microservices?"

## Expected Output

The system will analyze multiple factors:
- Scalability
- Development Complexity
- Operational Overhead
- Deployment Flexibility
- System Resilience

For each factor, you'll get:
- Arguments for and against
- Evidence and reasoning
- Fact-checked accuracy scores
- Final balanced synthesis with recommendations

## Project Structure

```
backend/
├── shared/
│   └── schemas.py           # Pydantic data models
├── orchestrator/
│   ├── agent.py            # ADK agent logic
│   └── main.py             # A2A server
├── analyst/
│   ├── agent.py
│   └── main.py
├── debaters/
│   ├── protagonist/
│   │   ├── agent.py
│   │   └── main.py
│   └── antagonist/
│       ├── agent.py
│       └── main.py
├── verifier/
│   ├── agent.py
│   ├── main.py
│   └── tools.py            # Fact-checking tools
├── synthesizer/
│   ├── agent.py
│   ├── main.py
│   └── tools.py            # Synthesis tools
├── run_all.py              # Start all agents
└── requirements.txt
```

## Next Steps

1. **Test the system** with your own topics
2. **Customize agents** by modifying their instructions
3. **Add new tools** to enhance capabilities
4. **Integrate with frontend** (Next.js app in `/frontend`)

## Troubleshooting

**Port already in use?**
```bash
# Set custom ports in .env
cp .env.example .env
# Edit .env and change port numbers
```

**Import errors?**
```bash
# Ensure you're in the backend directory
cd backend
# Reinstall dependencies
pip install -r requirements.txt
```

## Support

For issues or questions, check the main README.md in the backend directory.

---

**Ready to start?**
```bash
python run_all.py
```

Enjoy using Prizm AI! 🎉
