from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader  # type: ignore
import io
import re

app = Flask(__name__)
CORS(app, methods="*", origins="*")  # Enable CORS for all routes

# Common skills to look for (expanded list)
COMMON_SKILLS = [
    # Programming Languages
    "python", "java", "javascript", "c++", "c#", "ruby", "php", "swift", "kotlin", "go", "rust", "typescript",
    "scala", "perl", "r", "matlab", "bash", "powershell", "vba", "objective-c", "dart", "assembly", "fortran",

    # Web Development
    "html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask", "bootstrap", "jquery",
    "sass", "less", "webpack", "gatsby", "next.js", "nuxt.js", "tailwind", "graphql", "rest api", "soap",

    # Database
    "sql", "mysql", "mongodb", "postgresql", "oracle", "nosql", "redis", "elasticsearch", "firebase",
    "dynamodb", "cassandra", "mariadb", "sqlite", "neo4j", "couchdb", "ms sql server",

    # DevOps & Cloud
    "docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "git", "ci/cd", "terraform", "ansible",
    "linux", "unix", "github", "bitbucket", "gitlab", "circleci", "travis ci", "heroku", "nginx", "apache",

    # AI/ML
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "nlp", "computer vision",
    "data science", "pandas", "numpy", "keras", "opencv", "data mining", "neural networks", "ai",

    # Mobile Development
    "android", "ios", "react native", "flutter", "xamarin", "ionic", "swift ui", "kotlin multiplatform",

    # Tools & Software
    "microsoft office", "excel", "powerpoint", "word", "outlook", "jira", "confluence", "trello",
    "slack", "photoshop", "illustrator", "figma", "sketch", "adobe xd", "tableau", "power bi",

    # Soft Skills
    "leadership", "communication", "teamwork", "problem solving", "critical thinking", "time management",
    "project management", "agile", "scrum", "kanban", "lean", "six sigma", "customer service"
]

@app.route('/extract_skills', methods=['POST'])
def extract_skills_from_pdf():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided", "success": False}), 400

    pdf_file = request.files['pdf_file']

    if not pdf_file.filename or not pdf_file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid or no PDF file selected", "success": False}), 400

    try:
        # Read PDF content
        pdf_bytes = pdf_file.read()
        pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
        text = "".join(page.extract_text() or "" for page in pdf_reader.pages)

        # Case-insensitive skill detection
        text_lower = text.lower()
        found_skills = [skill for skill in COMMON_SKILLS if re.search(rf'\b{re.escape(skill)}\b', text_lower)]

        # Extract custom skills from "Skills" sections
        skills_section = re.search(
            r'(?i)(?:skills|technical skills|core competenc(?:ies|es)|proficienc(?:ies|es))[:;]?([\s\S]*?)(?:\n\s*\n|\n[A-Z]|\Z)',
            text
        )
        custom_skills = []
        if skills_section:
            skills_text = skills_section.group(1)
            skill_items = re.split(r'[•\*\-,\n]', skills_text)
            custom_skills = [
                item.strip() for item in skill_items
                if item.strip() and len(item.strip()) > 2 and len(item.strip()) < 50
                and item.strip().lower() not in (s.lower() for s in found_skills)
                and not re.match(r'^(and|or|the|in|on|with|of|for|to|by|as|at)$', item.strip().lower())
            ]

        # Combine and deduplicate
        all_skills = list(set(found_skills + custom_skills))

        return jsonify({
            "success": True,
            "extracted_skills": all_skills,
            "text_length": len(text)
        })

    except Exception as e:
        print(f"Error processing PDF: {str(e)}")  # Debugging log

        return jsonify({"error": f"Failed to process PDF: {str(e)}", "success": False}), 500

if __name__ == '__main__':
    print("Starting server on port 5000...")
    app.run(host='0.0.0.0', port=5000)
