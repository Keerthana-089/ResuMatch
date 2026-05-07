def generate_suggestions(resume_keywords, job_keywords):
    missing = list(set(job_keywords) - set(resume_keywords))

    suggestions = []
    for word in missing:
        suggestions.append(f"Add '{word}' to your resume")

    if len(resume_keywords) < 5:
        suggestions.append("Add more skills to strengthen your resume")

    return suggestions