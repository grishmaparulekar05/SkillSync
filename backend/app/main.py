from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .schemas import ScreeningResult
from .services.resume_parser import extract_resume_text
from .services.screening_service import screen_resume


app = FastAPI(
    title="AI Resume Screening Agent",
    description=(
        "Resume parsing, job-related skill matching, "
        "and explainable screening results."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def root():
    return {
        "application": "AI Resume Screening Agent",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/v1/health")
def health():
    return {"status": "healthy"}


@app.post("/api/v1/screen", response_model=ScreeningResult)
async def screen_candidate(
    job_description: str = Form(..., min_length=20, max_length=20000),
    resume: UploadFile = File(...),
):
    filename = resume.filename or ""

    if not filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Upload a PDF or DOCX resume.",
        )

    try:
        content = await resume.read(10 * 1024 * 1024 + 1)

        resume_text = extract_resume_text(filename, content)

        result = screen_resume(
            resume_text=resume_text,
            job_description=job_description,
        )

        return ScreeningResult(
            filename=filename,
            extracted_text_length=len(resume_text),
            **result,
        )

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    finally:
        await resume.close()