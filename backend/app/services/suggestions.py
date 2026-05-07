def generate_suggestions(missing_keywords, role):

    suggestions = []

    for keyword in missing_keywords[:4]:
        suggestions.append({
            "title": f"Add {keyword}",
            "description":
                f"Your resume is missing '{keyword}' "
                f"which is important for {role} roles.",
            "priority": "HIGH"
        })

    suggestions.append({
        "title": "Improve project descriptions",
        "description":
            "Add measurable achievements and impact in projects.",
        "priority": "MEDIUM"
    })

    suggestions.append({
        "title": "Optimize ATS formatting",
        "description":
            "Use clean headings and avoid excessive graphics.",
        "priority": "LOW"
    })

    return suggestions