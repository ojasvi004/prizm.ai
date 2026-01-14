from fpdf import FPDF

class PrizmPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 15)
        self.cell(0, 10, "Prizm.ai | AETHER Deliberative Report", ln=True, align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def generate_report_pdf(report_data, output_path="Prizm_Final_Report.pdf"):
    pdf = PrizmPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=11)

    # Executive Summary
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 10, "Executive Summary", ln=True)
    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(0, 7, report_data.executive_summary)
    pdf.ln(5)

    # Recommendations
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 10, "Strategic Recommendations", ln=True)
    pdf.set_font("Helvetica", size=11)
    for rec in report_data.recommendations:
        pdf.multi_cell(0, 7, f"- {rec}")
    
    pdf.output(output_path)
    return output_path