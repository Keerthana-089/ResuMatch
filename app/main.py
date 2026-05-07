from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.services.parser import parse_pdf
from app.services.keywords import extract_keywords
from app.services.ats import calculate_ats_score
from app.services.summarizer import summarize_text
from app.services.suggestions import generate_suggestions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ResuMatch Running 🚀"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), role: str = Form(...)):

    content = await file.read()

    if file.filename.endswith(".pdf"):
        text = parse_pdf(content)
    else:
        text = content.decode(errors="ignore")

    resume_keywords = extract_keywords(text)

    job_keywords = [
        "python",
        "sql",
        "machine learning",
        "data analysis",
        "pandas",
        "numpy",
        "power bi"
    ]

    score = calculate_ats_score(resume_keywords, job_keywords)

    summary = summarize_text(text)

    suggestions = generate_suggestions(
        resume_keywords,
        job_keywords
    )

    return {
        "score": score,
        "keywords": list(resume_keywords),
        "summary": summary,
        "suggestions": suggestions
    }