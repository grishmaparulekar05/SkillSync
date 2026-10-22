from pydantic import BaseModel, Field


class ScreeningRequest(BaseModel):
    job_description: str = Field(
        min_length=20,
        max_length=20000,
        description="The job description used to evaluate the resume.",
    )


class ScreeningResult(BaseModel):
    filename: str
    extracted_text_length: int
    matched_skills: list[str]
    missing_skills: list[str]
    match_score: float
    explanation: str