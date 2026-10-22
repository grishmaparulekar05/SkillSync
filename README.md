# SkillSync AI — Intelligent Resume Screening & Interview Assistant

**Aligning Skills. Empowering Careers.**

SkillSync AI is an AI-powered resume screening prototype that analyzes resumes against job descriptions using Natural Language Processing (NLP), skill matching, and semantic similarity. It provides a match score, matched skills, missing recognized skills, and an explanation to support human recruiters.

## Features

- Upload resumes in PDF and DOCX formats.
- Extract text from resumes automatically.
- Compare resume content with job descriptions.
- Identify matched and missing recognized skills.
- Calculate a hybrid match score using skill coverage and semantic similarity.
- Display explainable results through a React dashboard.
- Provide API documentation through FastAPI.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Python
- FastAPI
- PyMuPDF
- python-docx
- Sentence Transformers
- scikit-learn
- NumPy

## Project Structure

```text
SkillSync-AI/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── services/
│   └── requirements.txt
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.10 or a compatible version
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/SkillSync-AI.git
cd SkillSync-AI
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the environment on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the API server:

```bash
python -m uvicorn app.main:app --reload
```

Backend API: `http://127.0.0.1:8000`

Interactive API documentation: `http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## How It Works

1. The user uploads a resume and enters a job description.
2. The backend extracts readable text from the resume.
3. The system identifies recognized skills in the resume and job description.
4. A Sentence Transformer generates embeddings for semantic similarity comparison.
5. The system combines skill coverage and semantic similarity into a screening score.
6. The dashboard displays the score, matched skills, missing recognized skills, and explanation.

## Scoring Method

The current prototype uses a weighted score:

- **60% — Recognized skill coverage**
- **40% — Semantic similarity**

The score is a preliminary matching signal, not a probability of job success or a validated hiring recommendation. Results depend on the skill dictionary, extracted text, and model behavior.

## Limitations

- Scanned PDFs may require OCR, which is not currently included.
- Skill recognition depends on the configured vocabulary.
- Semantic similarity may not reliably capture every job requirement.
- The model and scoring weights have not been validated against hiring outcomes.
- Results should be reviewed by a human and should not be used as the sole basis for hiring decisions.


## Output Screenshots

### 1. Application Dashboard
![SkillSync AI Dashboard](C:\Users\NIKHIL\AI-Resume-Screening-Agent\screenshots\Screenshot 2026-10-22 120347.png)

### 2. Screening Interface
![Resume Screening Interface](C:\Users\NIKHIL\AI-Resume-Screening-Agent\screenshots\Screenshot 2026-10-22 120410.png)

### 3. Resume Screening Results
![SkillSync AI Screening Result](C:\Users\NIKHIL\AI-Resume-Screening-Agent\screenshots\Screenshot 2026-10-22 120428.png)


## Future Enhancements

- Multilingual resume and job-description analysis.
- Interview question generation.
- Candidate comparison and screening history.
- PostgreSQL database integration.
- OCR for scanned resumes.
- Expanded skill taxonomy and evaluation datasets.
- Authentication and recruiter dashboards.

## Responsible Use

SkillSync AI is a prototype designed to assist recruiters, not replace human judgment. Do not use its score as the sole basis for hiring or rejection. Evaluate the system for accuracy, privacy, accessibility, and potential bias before real-world deployment.

## License

No open-source license has been selected yet.