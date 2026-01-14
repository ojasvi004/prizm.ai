import os
from fpdf import FPDF
from google import genai
from google.genai import types
from backend.tools.pdf_generator import generate_report_pdf
from schemas.messages import FinalReport

class SynthesizerAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def summarize(self, debate_context: str) -> FinalReport:
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[f"Synthesize this debate into a report: {debate_context}"],
            config=types.GenerateContentConfig(
                system_instruction="Create a final decision report. Explain what worked and what failed.",
                response_mime_type="application/json",
                response_schema=FinalReport,
            ),
        )
        return response.parsed

    def create_pdf(self, report: FinalReport, filename: str = "Prizm_Report.pdf"):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(40, 10, "Deliberative Report")
        pdf.ln(20)
        
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, f"Summary: {report.executive_summary}")
        pdf.ln(10)
        
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(0, 10, "Recommendations:")
        pdf.ln(10)
        pdf.set_font("Arial", size=12)
        for rec in report.recommendations:
            pdf.cell(0, 10, f"- {rec}", ln=True)
            
        pdf.output(filename)
        return filename
    
    def finalize(self, structured_report):
        print("🛠️ Generating final document...")
        return generate_report_pdf(structured_report)