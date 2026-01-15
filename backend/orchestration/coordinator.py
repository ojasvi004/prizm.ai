from agents.factor_extractor import FactorExtractorAgent
from agents.supportive_agent import SupportiveAgent
from agents.opposing_agent import OpposingAgent
from agents.synthesizer_agent import SynthesizerAgent
from orchestration.debate_manager import DebateManager
import json
import logging
import re

logger = logging.getLogger(__name__)


def clean_json_response(text):
    """Remove markdown code blocks and extract clean JSON"""
    if not text:
        return text

    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)

    text = text.strip()

    return text


class AetherCoordinator:
    def __init__(self):
        self.factor_agent = FactorExtractorAgent()
        self.support_agent = SupportiveAgent()
        self.oppose_agent = OpposingAgent()
        self.synth_agent = SynthesizerAgent()
        self.debate_manager = DebateManager()

    def analyze(self, report):
        """
        Orchestrates the PRIZM multi-agent analysis pipeline.
        Each agent passes JSON to the next agent in the chain.
        """
        try:
            logger.info("Step 1: Extracting factors...")
            factor_json_raw = self.factor_agent.extract(report)
            factor_json_clean = clean_json_response(factor_json_raw)
            factor_data = json.loads(factor_json_clean)

            logger.info("Step 2: Generating supportive arguments...")
            supportive_json_raw = self.support_agent.analyze(
                json.dumps(factor_data, indent=2), report
            )
            supportive_json_clean = clean_json_response(supportive_json_raw)
            supportive_data = json.loads(supportive_json_clean)

            logger.info("Step 3: Generating opposing arguments...")
            opposing_json_raw = self.oppose_agent.analyze(
                json.dumps(supportive_data, indent=2), None
            )
            opposing_json_clean = clean_json_response(opposing_json_raw)
            opposing_data = json.loads(opposing_json_clean)

            logger.info("Step 4: Synthesizing final report...")
            final_report = self.synth_agent.synthesize(
                json.dumps(opposing_data, indent=2)
            )

            # Clean the final report
            final_report = clean_json_response(final_report)

            # Build structured debates for output
            debates = []
            factors = opposing_data.get("extracted_factors", [])
            supportive_args = opposing_data.get("supportive_arguments", [])
            opposing_args = opposing_data.get("opposing_arguments", [])

            for factor in factors:
                factor_id = factor.get("factor_id")

                support = next(
                    (s for s in supportive_args if s.get("factor_id") == factor_id), {}
                )
                oppose = next(
                    (o for o in opposing_args if o.get("factor_id") == factor_id), {}
                )

                debates.append(
                    {
                        "factor": {
                            "id": factor_id,
                            "title": factor.get("title"),
                            "description": factor.get("description"),
                            "source_quote": factor.get("source_quote"),
                        },
                        "supportive": {
                            "summary": support.get("argument_summary", ""),
                            "evidence": support.get("evidence_quotes", []),
                            "logic": support.get("logical_chain", ""),
                            "assumptions": support.get("assumptions", []),
                        },
                        "opposing": {
                            "summary": oppose.get("rebuttal_summary", ""),
                            "critiques": oppose.get("critique_points", []),
                            "missing_context": oppose.get("missing_context", ""),
                        },
                    }
                )

            self.debate_manager.debates = debates
            self.debate_manager.save()

            return {"final_report": final_report, "debates": debates}

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            logger.error(
                f"Failed to parse: {factor_json_raw if 'factor_json_raw' in locals() else supportive_json_raw if 'supportive_json_raw' in locals() else opposing_json_raw if 'opposing_json_raw' in locals() else 'unknown'}"
            )
            raise Exception(f"Agent returned invalid JSON: {str(e)}")
        except Exception as e:
            logger.error(f"Analysis error: {str(e)}")
            raise

    def analyze_stream(self, report):
        """
        Streaming version of analyze() that yields events in real-time.
        Perfect for live debate visualization in the frontend.

        Yields events as each agent completes their turn.
        """
        try:
            yield {
                "event": "agent_start",
                "agent": "factor_extractor",
                "message": "Analyzing report and extracting key factors...",
            }

            factor_json_raw = self.factor_agent.extract(report)
            factor_json_clean = clean_json_response(factor_json_raw)
            factor_data = json.loads(factor_json_clean)

            yield {
                "event": "agent_complete",
                "agent": "factor_extractor",
                "data": {"factors": factor_data.get("extracted_factors", [])},
            }

            factors = factor_data.get("extracted_factors", [])
            all_debates = []

            for idx, factor in enumerate(factors):
                yield {
                    "event": "agent_start",
                    "agent": "supportive_agent",
                    "factor_id": factor.get("factor_id"),
                    "factor_title": factor.get("title"),
                    "message": f"Arguing in favor of: {factor.get('title')}",
                }

                supportive_input = {
                    "original_source_text": factor_data.get("original_source_text"),
                    "extracted_factors": [factor],
                }

                supportive_json_raw = self.support_agent.analyze(
                    json.dumps(supportive_input, indent=2), report
                )
                supportive_json_clean = clean_json_response(supportive_json_raw)
                supportive_data = json.loads(supportive_json_clean)

                supportive_arg = supportive_data.get("supportive_arguments", [{}])[0]

                yield {
                    "event": "agent_complete",
                    "agent": "supportive_agent",
                    "factor_id": factor.get("factor_id"),
                    "data": {"argument": supportive_arg},
                }

                yield {
                    "event": "agent_start",
                    "agent": "opposing_agent",
                    "factor_id": factor.get("factor_id"),
                    "factor_title": factor.get("title"),
                    "message": f"Challenging the argument for: {factor.get('title')}",
                }

                opposing_json_raw = self.oppose_agent.analyze(
                    json.dumps(supportive_data, indent=2), None
                )
                opposing_json_clean = clean_json_response(opposing_json_raw)
                opposing_data = json.loads(opposing_json_clean)

                opposing_arg = opposing_data.get("opposing_arguments", [{}])[0]

                yield {
                    "event": "agent_complete",
                    "agent": "opposing_agent",
                    "factor_id": factor.get("factor_id"),
                    "data": {"argument": opposing_arg},
                }

                all_debates.append(
                    {
                        "factor": {
                            "id": factor.get("factor_id"),
                            "title": factor.get("title"),
                            "description": factor.get("description"),
                            "source_quote": factor.get("source_quote"),
                        },
                        "supportive": {
                            "summary": supportive_arg.get("argument_summary", ""),
                            "evidence": supportive_arg.get("evidence_quotes", []),
                            "logic": supportive_arg.get("logical_chain", ""),
                            "assumptions": supportive_arg.get("assumptions", []),
                        },
                        "opposing": {
                            "summary": opposing_arg.get("rebuttal_summary", ""),
                            "critiques": opposing_arg.get("critique_points", []),
                            "missing_context": opposing_arg.get("missing_context", ""),
                        },
                    }
                )

            yield {
                "event": "agent_start",
                "agent": "synthesizer_agent",
                "message": "Synthesizing final judgment and recommendations...",
            }

            synthesis_input = {
                "original_source_text": factor_data.get("original_source_text"),
                "extracted_factors": factors,
                "supportive_arguments": [d["supportive"] for d in all_debates],
                "opposing_arguments": [d["opposing"] for d in all_debates],
            }

            final_report = self.synth_agent.synthesize(
                json.dumps(synthesis_input, indent=2)
            )
            final_report = clean_json_response(final_report)

            yield {
                "event": "agent_complete",
                "agent": "synthesizer_agent",
                "data": {"final_report": final_report},
            }

            self.debate_manager.debates = all_debates
            self.debate_manager.save()

            yield {
                "event": "analysis_complete",
                "data": {"debates": all_debates, "final_report": final_report},
            }

        except Exception as e:
            logger.error(f"Streaming analysis error: {str(e)}")
            yield {"event": "error", "message": str(e)}
