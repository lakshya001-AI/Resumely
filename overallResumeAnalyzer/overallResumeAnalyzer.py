
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import spacy # type: ignore
from pathlib import Path
import os
import chardet # type: ignore

# Load the Spacy NLP model
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    resume_file = request.files['resume']
    temp_file = Path(f"temp_{resume_file.filename}")
    with open(temp_file, "wb") as f:
        f.write(resume_file.read())

    try:
        parsed_data = parse_resume(temp_file)
        os.remove(temp_file)

        score = calculate_resume_score(parsed_data)
        suggestions = generate_resume_suggestions(parsed_data)
        recommendations = recommend_skills("Data Science")
        tips = resume_tips()
        # Extract the user's name from parsed_data
        user_name = parsed_data.get('name', 'User')

        return jsonify({
            'user_name': user_name,  # Include the user's name in the response
            'parsed_data': parsed_data,
            'score': score,
            'suggestions': suggestions,
            'recommended_skills': recommendations,
            'resume_tips': tips
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500



def parse_resume(resume_path):
    """Custom resume parsing using Spacy with encoding detection."""
    parsed_data = {
        "name": None,
        "email": None,
        "skills": [],
        "degree": None,
        "experience": []
    }

    # Detect encoding
    with open(resume_path, "rb") as file:
        raw_data = file.read()
        result = chardet.detect(raw_data)
        encoding = result['encoding'] or 'utf-8'

    # Read the file using the detected encoding
    with open(resume_path, "r", encoding=encoding, errors='replace') as file:
        resume_text = file.read()

    # Process the resume text with Spacy
    doc = nlp(resume_text)

    # Extract Name (Refined Logic)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and is_valid_name(ent.text):
            parsed_data["name"] = ent.text.strip()
            break  # Stop after finding the first valid name

    # Extract Email
    for token in doc:
        if token.like_email:
            parsed_data["email"] = token.text

    # Extract Skills (Custom Skill List Matching)
    skills_list = ["Python", "Java", "SQL", "Machine Learning", "React", "Node.js"]
    parsed_data["skills"] = [
        skill for skill in skills_list if skill.lower() in resume_text.lower()
    ]

    # Extract Degrees (Using Keywords)
    degree_keywords = ["Bachelor", "Master", "PhD", "B.Sc", "M.Sc"]
    for sent in doc.sents:
        for keyword in degree_keywords:
            if keyword.lower() in sent.text.lower():
                parsed_data["degree"] = sent.text.strip()
                break

    # Extract Experience (Simple Heuristic for Years Mentioned)
    for sent in doc.sents:
        if "experience" in sent.text.lower() or "years" in sent.text.lower():
            parsed_data["experience"].append(sent.text.strip())

    return parsed_data


def is_valid_name(name):
    """Validate extracted names."""
    invalid_names = {"en-GB", "Resume", "Curriculum Vitae"}
    if name in invalid_names or len(name.split()) > 4:
        return False
    # Further validation: Check for alphabetical characters and plausible length
    return all(word.isalpha() for word in name.split()) and len(name.split()) >= 2



def calculate_resume_score(parsed_data):
    score = 0
    essential_fields = ['name', 'email', 'skills', 'degree', 'experience']
    for field in essential_fields:
        if parsed_data.get(field):
            score += 20
    return min(score, 100)

def generate_resume_suggestions(parsed_data):
    suggestions = []
    if not parsed_data.get('experience'):
        suggestions.append("Add relevant work experience.")
    if len(parsed_data.get('skills', [])) < 5:
        suggestions.append("Include more skills.")
    if not parsed_data.get('degree'):
        suggestions.append("Add educational background.")
    return suggestions

def recommend_skills(job_field):
    skills = {
        "Data Science": ["Python", "R", "SQL", "Machine Learning", "Deep Learning"],
        "Web Development": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        "Mobile Development": ["Kotlin", "Swift", "Flutter", "React Native"]
    }
    return skills.get(job_field, [])

def resume_tips():
    return [
        "Keep it concise.",
        "Use bullet points.",
        "Focus on achievements.",
        "Professional formatting."
    ]

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)

