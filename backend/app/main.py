from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.services.parser import parse_pdf
from app.services.keywords import extract_keywords
from app.services.ats import calculate_ats_score
from app.services.summarizer import summarize_text
from app.services.suggestions import generate_suggestions
import inspect
from app.services.roles import ROLE_KEYWORDS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), role: str = Form(...)):

    content = await file.read()

    if file.filename.endswith(".pdf"):
        text = parse_pdf(content)
    else:
        text = content.decode(errors="ignore")

    resume_keywords = extract_keywords(text, role)

    job_keywords = ROLE_KEYWORDS.get(
        role,
        ROLE_KEYWORDS["Software Engineer"]
    )

    summary = summarize_text(text)

    # compute matched and missing keywords for suggestions/response
    matched_keywords = list(resume_keywords)
    missing_keywords = list(set(job_keywords) - set(resume_keywords))

    score_data = calculate_ats_score(
        matched_keywords,
        missing_keywords,
        job_keywords
    )

    # call generate_suggestions from services in a signature-safe way
    sig = inspect.signature(generate_suggestions)
    params_count = len(sig.parameters)

    if params_count == 1:
        suggestions = generate_suggestions(missing_keywords)
    elif params_count == 2:
        suggestions = generate_suggestions(missing_keywords, role)
    else:
        # fallback to older 3-arg signature if present
        suggestions = generate_suggestions(
            resume_keywords,
            job_keywords,
            text
        )

    return {
        "score": score_data["score"],

        "scoreBreakdown": {

    "keywordMatch":
        score_data["scoreBreakdown"]["keywordMatch"],

    "structure":
        score_data["scoreBreakdown"]["structure"],

    "formatting":
        score_data["scoreBreakdown"]["formatting"],

    "readability":
        score_data["scoreBreakdown"]["readability"]
        },

        "matchedKeywords": matched_keywords,

        "missingKeywords": missing_keywords,

        "summary": {
            "overview":
                summary["overview"],

            "skills":
                summary["skills"],

            "experience": [
                "Worked on AI-based projects",
                "Built resume ATS analyzer"
            ],

            "achievements": [
                "Strong Python knowledge",
                "Good frontend skills"
            ]
        },

        "suggestions": suggestions,

        "trendingSkills": [
            {
                "skill": skill,
                "value": 70 + (i * 5)
            }
            for i, skill in enumerate(job_keywords[:6])
        ]
    }


