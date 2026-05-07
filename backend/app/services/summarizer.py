import re

def summarize_text(text):

    lines = text.split("\n")

    skills = []
    experience = []
    achievements = []

    skill_keywords = [
        "python", "java", "react", "node.js", "javascript",
        "html", "css", "sql", "machine learning",
        "aws", "docker", "kubernetes", "flask"
    ]

    text_lower = text.lower()

    for skill in skill_keywords:
        if skill in text_lower:
            skills.append(skill.title())

    for line in lines:
        l = line.strip()

        if len(l) < 20:
            continue

        if any(word in l.lower() for word in [
            "developed",
            "built",
            "designed",
            "created",
            "implemented",
            "worked"
        ]):
            experience.append(l)

        if any(word in l.lower() for word in [
            "certified",
            "award",
            "achievement",
            "winner",
            "gpa",
            "rating"
        ]):
            achievements.append(l)

    overview = (
        "Motivated Computer Science student with strong "
        "skills in software development and AI projects."
    )

    return {
        "overview": overview,
        "skills": skills[:10],
        "experience": experience[:5],
        "achievements": achievements[:5]
    }