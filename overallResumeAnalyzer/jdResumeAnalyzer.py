from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import spacy  # type: ignore
from pathlib import Path
import os
import chardet  # type: ignore
import re
import fitz  # PyMuPDF for PDF text extraction, must be installed

# Load the Spacy NLP model
nlp = spacy.load("en_core_web_sm")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze-resume-with-title', methods=['POST'])
def analyze_resume_with_title():
    """
    Endpoint to analyze resume against a job title.
    """
    if 'resume' not in request.files or 'job_title' not in request.form:
        return jsonify({'error': 'Resume and job title are required'}), 400

    resume_file = request.files['resume']
    job_title = request.form['job_title']
    temp_file = Path(f"temp_{resume_file.filename}")

    try:
        # Save the resume file temporarily
        with open(temp_file, "wb") as f:
            f.write(resume_file.read())

        # Parse resume
        parsed_resume = parse_resume(temp_file)

        # Debugging: Print parsed data
        print("Parsed Resume:", parsed_resume)

        # Clean up temporary file
        os.remove(temp_file)

        # Perform analysis
        match_score = calculate_match_score(parsed_resume, job_title)
        suggestions = generate_title_based_suggestions(parsed_resume, job_title)
        tips = generate_tips(parsed_resume)
        recommended_skills = recommend_skills("Data Science")

        # Debugging: Print match score and suggestions
        print("Match Score:", match_score)
        print("Suggestions:", suggestions)
        print("Tips:", tips)

        # Return results
        return jsonify({
            'parsed_resume': parsed_resume,
            'match_score': match_score,
            'suggestions': suggestions,
            'tips': tips,
            'recommended_skills': recommended_skills
        })
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': str(e)}), 500
    
    
    


def is_valid_name(name):
    """
    Validate extracted names to avoid invalid entries.
    """
    invalid_names = {"en-GB", "Resume", "Curriculum Vitae", "Docs Renderer"}
    return (
        name not in invalid_names and
        2 <= len(name.split()) <= 4 and
        all(word.isalpha() for word in name.split())
    )


def extract_text_from_pdf(pdf_path):
    """
    Extract text from PDF file using PyMuPDF (fitz).
    """
    doc = fitz.open(str(pdf_path))
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def parse_resume(resume_path):
    """
    Parse the resume file to extract relevant information.
    """
    parsed_data = {
        "name": None,
        "skills": [],
        "job_title": None
    }

    # Detect file type based on suffix
    suffix = resume_path.suffix.lower()
    if suffix == '.pdf':
        resume_text = extract_text_from_pdf(resume_path)
    else:
        # Detect encoding of the file
        with open(resume_path, "rb") as file:
            raw_data = file.read()
            encoding = chardet.detect(raw_data)['encoding'] or 'utf-8'
        # Read resume text with detected encoding
        with open(resume_path, "r", encoding=encoding, errors='replace') as file:
            resume_text = file.read()

    # Process text with Spacy
    doc = nlp(resume_text)

    # Extract name using PERSON entity that passes validity check
    parsed_data["name"] = next(
        (ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON" and is_valid_name(ent.text)), "Name not found"
    )

    # Extract job title heuristically:
    # 1. Look for lines containing common title keywords
    # 2. Or fallback to the first non-empty line after name mention

    # Prepare lines of text for heuristic
    lines = [line.strip() for line in resume_text.split('\n') if line.strip()]

    # Lowercase job title keywords to look for
    title_keywords = ['position', 'role', 'title', 'job', 'designation']

    job_title_found = None
    for line in lines:
        # Check if line contains any title keywords (case insensitive)
        if any(keyword in line.lower() for keyword in title_keywords):
            job_title_found = line
            break

    # If not found by keyword, try to guess position by looking near the name in text
    if not job_title_found:
        # Find line with the name
        name_lower = parsed_data["name"].lower() if parsed_data["name"] != "Name not found" else None
        idx = None
        if name_lower:
            for i, line in enumerate(lines):
                if name_lower in line.lower():
                    idx = i
                    break
        if idx is not None and idx + 1 < len(lines):
            job_title_found = lines[idx + 1]
    # Fallback first non-empty line
    if not job_title_found and lines:
        job_title_found = lines[0]

    parsed_data["job_title"] = job_title_found or "Job title not found"

    # Match skills using a more flexible approach
    skills_list = ["Python", "Java", "SQL", "Machine Learning", "React", "Node.js"]
    parsed_data["skills"] = [skill for skill in skills_list if re.search(r'\b' + re.escape(skill.lower()) + r'\b', resume_text.lower())]

    return parsed_data


def calculate_match_score(resume_data, job_title):
    """
    Calculate match score between resume job title and provided job title.
    """
    resume_job_title = resume_data.get("job_title", "").lower()
    provided_job_title = job_title.lower()

    # Simple match score calculation based on exact and partial match
    if resume_job_title == provided_job_title:
        return "100"
    elif provided_job_title in resume_job_title or resume_job_title in provided_job_title:
        return "75"
    else:
        return "0"


def generate_title_based_suggestions(resume_data, job_title):
    """
    Generate suggestions to improve resume based on job title.
    """
    suggestions = []

    if resume_data.get("job_title") != job_title:
        suggestions.append("Consider aligning your job title with the job you are applying for.")

    if not resume_data.get("skills"):
        suggestions.append("Add relevant skills to your resume.")

    if resume_data.get("name") == "Name not found":
        suggestions.append("Make sure to include your name in the resume.")

    if not suggestions:
        suggestions.append("Your resume job title matches the provided job title!")

    return suggestions


def generate_tips(resume_data):
    """
    Generate tips based on the parsed resume data.
    """
    tips = []
    if resume_data.get("skills"):
        tips.append("Highlight your key skills prominently.")
    else:
        tips.append("Consider adding skills that are relevant to the job title.")
    
    if resume_data.get("name") == "Name not found":
        tips.append("Ensure your name is clearly stated at the top of your resume.")

    return tips

def recommend_skills(job_field):
    """
    Recommend skills based on the job field.
    """
    skills = {
        "Data Science": ["Python", "R", "SQL", "Machine Learning", "Deep Learning"],
        "Web Development": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        "Mobile Development": ["Kotlin", "Swift", "Flutter", "React Native"],
        "Cybersecurity": ["Network Security", "Penetration Testing", "Cryptography", "Firewalls"],
        "Cloud Computing": ["AWS", "Azure", "Docker", "Kubernetes", "DevOps"]
    }
    return skills.get(job_field, ["No specific skills recommended for this field."])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)

