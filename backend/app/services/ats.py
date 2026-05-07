def calculate_ats_score(matched_keywords, missing_keywords, role_keywords):
    keyword_score = int(
        (len(matched_keywords) / max(len(role_keywords), 1)) * 100
    )

    structure_score = 85
    formatting_score = 80
    readability_score = 75

    final_score = int(
        (
            keyword_score
            + structure_score
            + formatting_score
            + readability_score
        ) / 4
    )

    return {
        "score": final_score,
        "scoreBreakdown": {
            "keywordMatch": keyword_score,
            "structure": structure_score,
            "formatting": formatting_score,
            "readability": readability_score,
        },
    }