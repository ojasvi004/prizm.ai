"""
Prizm AI - Root Agent for ADK Web Server
Multi-agent orchestration for critical document analysis
"""
import os
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import specialized agents
from .extractor import ExtractorAgent
from .supporter import SupporterAgent
from .opponent import OpponentAgent
from .verifier import VerifierAgent
from .synthesizer import SynthesizerAgent


class PrizmOrchestrator:
    """Custom orchestrator that coordinates all specialized agents"""
    
    def __init__(self):
        self.extractor = ExtractorAgent()
        self.supporter = SupporterAgent()
        self.opponent = OpponentAgent()
        self.verifier = VerifierAgent()
        self.synthesizer = SynthesizerAgent()

    async def run_analysis(self, prompt: str, file_path: str = None):
        """
        Run complete multi-agent analysis pipeline
        
        Args:
            prompt: User's analysis request
            file_path: Optional path to document/image to analyze
            
        Returns:
            PDF file path with the complete analysis report
        """
        # 1. Extraction (Multimodal)
        print("🔍 Extracting factors...")
        factors = self.extractor.process(prompt, file_path)

        # 2. Deliberation & Verification (Parallel Phase)
        print("⚔️ Running debate and verification...")
        support_task = asyncio.to_thread(self.supporter.argue, factors)
        verify_task = asyncio.to_thread(self.verifier.verify, str(factors))
        
        support_args, verification = await asyncio.gather(support_task, verify_task)

        # 3. Opposition Phase
        print("🛡️ Opponent is challenging the claims...")
        opponent_args = self.opponent.challenge(factors, support_args)

        # 4. Final Synthesis
        print("📄 Generating final PDF...")
        full_context = f"SUPPORT: {support_args}\nOPPOSE: {opponent_args}\nFACT-CHECK: {verification}"
        structured_report = self.synthesizer.summarize(full_context)
        pdf_file = self.synthesizer.create_pdf(structured_report)
        
        return pdf_file


# Create the ADK-compatible root agent
root_agent = genai.Agent(
    name="prizm_orchestrator",
    model="gemini-2.0-flash-exp",
    system_instruction="""You are Prizm AI, an advanced multi-agent analysis system.

Your role is to coordinate a team of specialized agents to provide comprehensive document analysis:

🔍 **Extractor Agent**: Identifies key factors and claims from documents
⚔️ **Supporter Agent**: Builds strong supporting arguments and evidence
🛡️ **Opponent Agent**: Challenges claims with counterarguments and skepticism
✓ **Verifier Agent**: Fact-checks and validates information
📄 **Synthesizer Agent**: Creates comprehensive analysis reports

When a user provides a document or query:
1. Extract the main factors and claims
2. Run parallel analysis (support + verification)
3. Generate counter-arguments to test robustness
4. Synthesize all findings into a structured report
5. Generate a PDF with the complete analysis

You provide balanced, evidence-based insights by considering multiple perspectives.
""",
)


# Initialize the orchestrator instance for function calls
_orchestrator = None

def get_orchestrator():
    """Lazy initialization of orchestrator"""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = PrizmOrchestrator()
    return _orchestrator


# Entry point for testing
if __name__ == "__main__":
    orch = PrizmOrchestrator()
    # asyncio.run(orch.run_analysis("Evaluate this report", "test_report.png"))