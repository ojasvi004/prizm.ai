from agents.factor_extractor import FactorExtractorAgent
from agents.supportive_agent import SupportiveAgent
from agents.opposing_agent import OpposingAgent
from agents.synthesizer_agent import SynthesizerAgent
from orchestration.debate_manager import DebateManager

class AetherCoordinator:
    def __init__(self):
        self.factor_agent = FactorExtractorAgent()
        self.support_agent = SupportiveAgent()
        self.oppose_agent = OpposingAgent()
        self.synth_agent = SynthesizerAgent()
        self.debate_manager = DebateManager()

    def analyze(self, report):
        factors = self.factor_agent.extract(report)

        for factor in factors:
            support = self.support_agent.analyze(factor, report)
            oppose = self.oppose_agent.analyze(factor, support)
            self.debate_manager.add(factor, support, oppose)

        self.debate_manager.save()
        final_report = self.synth_agent.synthesize(self.debate_manager.debates)

        return {
            "final_report": final_report,
            "debates": self.debate_manager.debates
        }
