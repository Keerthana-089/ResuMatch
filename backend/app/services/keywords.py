ROLE_KEYWORDS = {
    "Software Engineer": [
        "python",
        "java",
        "react",
        "node.js",
        "docker",
        "aws",
        "kubernetes",
        "graphql",
        "rest",
        "sql",
        "javascript"
    ],

    "Data Scientist": [
        "python",
        "machine learning",
        "pandas",
        "numpy",
        "tensorflow",
        "sql",
        "statistics",
        "power bi"
    ],

    "UX Designer": [
        "figma",
        "wireframe",
        "prototype",
        "user research",
        "design systems",
        "ui",
        "ux"
    ]
}


def extract_keywords(text, role):

    role_keywords = ROLE_KEYWORDS.get(role, [])

    text_lower = text.lower()

    matched = []
    missing = []

    for keyword in role_keywords:
        if keyword.lower() in text_lower:
            matched.append(keyword)
        else:
            missing.append(keyword)

    return matched, missing