import cohere
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from langchain.llms import Cohere
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI

app = Flask(__name__)
CORS(app)

# Initialize API keys
COHERE_API_KEY = "BBK74cEhpbUdIj0gyOiSIEeg6F0L9ISHe6Bfo9HF"  # Replace with your Cohere API key
GEMINI_API_KEY = "AIzaSyAuVwzksyAl-eATP99mxACJq1Z1MLOscZc"  # Replace with your Gemini API key

# Initialize LangChain LLMs
cohere_llm = Cohere(cohere_api_key=COHERE_API_KEY)
google_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GEMINI_API_KEY)

# Define the new prompt template
template = """
You are a career counselor providing detailed and personalized advice. Based on the following user inputs, provide:
1. Three specific career paths that align with their interests and goals.
2. Three key skills they should focus on learning to achieve their goals.
3. Three high-quality learning resources (online courses, books, or websites) with descriptions to help them get started.

User Interests:
- {interests}

Skills they want to learn:
- {skills_to_learn}

Career Goals:
- {career_goals}

Format the response as follows:
Career Paths:
1. [Career Path 1]: [Description]
2. [Career Path 2]: [Description]
3. [Career Path 3]: [Description]

Skills to Learn:
1. [Skill 1]: [Description]
2. [Skill 2]: [Description]
3. [Skill 3]: [Description]

Learning Resources:
1. [Resource 1]: [Description and URL if applicable]
2. [Resource 2]: [Description and URL if applicable]
3. [Resource 3]: [Description and URL if applicable]
"""

# Update the prompt to include dynamic variables
prompt = PromptTemplate(template=template, input_variables=["interests", "skills_to_learn", "career_goals"])


# LangChain LLM Chains
cohere_chain = LLMChain(prompt=prompt, llm=cohere_llm)
google_chain = LLMChain(prompt=prompt, llm=google_llm)

# API Route to generate responses
@app.route("/generate", methods=["POST"])
def generate_response():
    try:
        # Extract user inputs from the request body
        data = request.json
        interests = data.get("interests", "")
        skills_to_learn = data.get("skills_to_learn", "")
        career_goals = data.get("career_goals", "")

        # Validate inputs
        if not (interests and skills_to_learn and career_goals):
            return jsonify({"error": "All fields (interests, skills_to_learn, career_goals) are required"}), 400

        # Generate responses using LangChain for both Cohere and Gemini
        cohere_response = cohere_chain.run({
            "interests": interests,
            "skills_to_learn": skills_to_learn,
            "career_goals": career_goals
        })

        google_response = google_chain.run({
            "interests": interests,
            "skills_to_learn": skills_to_learn,
            "career_goals": career_goals
        })
        
        print("Cohere: " + cohere_response)
        print("Google: " + google_response)

        # Return the response in the desired format
        return jsonify({
            "cohere_recommendation": cohere_response,
            "gemini_recommendation": google_response
        })
    except Exception as error:
        print("Error:", error)
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=4000)
