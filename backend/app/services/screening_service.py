import re


SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "fastapi",
    "django",
    "flask",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "machine learning",
    "deep learning",
    "natural language processing",
    "nlp",
    "scikit-learn",
    "pytorch",
    "tensorflow",
    "spacy",
    "sentence transformers",
    "data analysis",
    "pandas",
    "numpy",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "rest api",
    "communication",
    "project management",
}


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def find_skills(text: str) -> set[str]:
    normalized = normalize_text(text)
    found = set()

    for skill in SKILLS:
        pattern = rf"(?<!\w){re.escape(skill)}(?!\w)"

        if re.search(pattern, normalized):
            found.add(skill)

    return found


def screen_resume(resume_text: str, job_description: str) -> dict:
    resume_skills = find_skills(resume_text)
    job_skills = find_skills(job_description)

    if not job_skills:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "match_score": 0.0,
            "explanation": (
                "No recognized skills were identified in the job description. "
                "Add explicit job-related requirements for a meaningful "
                "skill comparison."
            ),
        }

    matched = sorted(resume_skills & job_skills)
    missing = sorted(job_skills - resume_skills)

    score = round(100 * len(matched) / len(job_skills), 2)

    if missing:
        explanation = (
            f"The resume contains evidence of {len(matched)} out of "
            f"{len(job_skills)} recognized job-description skills. "
            "The listed missing skills indicate that matching evidence "
            "was not found by this basic extractor; they do not prove "
            "the candidate lacks those skills."
        )
    else:
        explanation = (
            "All recognized skills in the job description were found "
            "in the extracted resume text. This is a keyword-based "
            "comparison, not a complete assessment of candidate suitability."
        )

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "match_score": score,
        "explanation": explanation,
    }