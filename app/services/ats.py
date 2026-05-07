def calculate_ats_score(resume_keywords, job_keywords):
    matched = set(resume_keywords).intersection(set(job_keywords))

    keyword_score = (len(matched) / len(job_keywords)) * 60
    structure_score = 20
    readability_score = 20

    total = keyword_score + structure_score + readability_score
    return round(total, 2)