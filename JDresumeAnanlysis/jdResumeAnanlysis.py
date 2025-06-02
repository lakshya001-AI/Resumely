from flask import Flask, request, jsonify
from flask_cors import CORS
import shutil
import os
from dotenv import load_dotenv
import google.generativeai as genai
from pdf2image import convert_from_path
import pytesseract
import pdfplumber

# Load environment variables
load_dotenv()

# Configure Google Gemini AI
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set in the environment variables.")
genai.configure(api_key=api_key)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text

        if text.strip():
            return text.strip()
    except Exception as e:
        print(f"Direct text extraction failed: {e}")

    try:
        images = convert_from_path(pdf_path)
        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
    except Exception as e:
        print(f"OCR failed: {e}")

    return text.strip()

# Function to analyze resume using Gemini AI
def analyze_resume(resume_text: str, job_description: str) -> str:
    if not resume_text:
        return "Resume text is required for analysis."
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    base_prompt = f"""
    You are an experienced HR with Technical Experience. Review the provided resume and provide the score:
    
    Resume:
    {resume_text}
    """
    if job_description:
        base_prompt += f"""
        Additionally, compare this resume to the following job description:
        
        Job Description:
        {job_description}
        """

    response = model.generate_content(base_prompt)
    return response.text.strip()

# Endpoint for resume analysis
@app.route("/analyze", methods=["POST"])
def analyze():
    if "resume" not in request.files or "job_description" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    resume = request.files["resume"]
    job_description = request.form["job_description"]

    # Save the uploaded resume
    temp_file_path = "uploaded_resume.pdf"
    try:
        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(resume, temp_file)

        # Extract text from the resume
        resume_text = extract_text_from_pdf(temp_file_path)

        # Analyze the resume
        analysis = analyze_resume(resume_text, job_description)
    finally:
        # Delete the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

    return jsonify({"analysis": analysis})

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
