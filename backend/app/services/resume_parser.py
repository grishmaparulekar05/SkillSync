from io import BytesIO

import fitz
from docx import Document


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def extract_resume_text(filename: str, content: bytes) -> str:
    if not content:
        raise ValueError("The uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError("The file exceeds the 10 MB limit.")

    extension = filename.lower().rsplit(".", 1)[-1]

    try:
        if extension == "pdf":
            with fitz.open(stream=content, filetype="pdf") as document:
                text = "\n".join(page.get_text() for page in document)

        elif extension == "docx":
            document = Document(BytesIO(content))
            paragraphs = [p.text for p in document.paragraphs]
            text = "\n".join(paragraphs)

        else:
            raise ValueError(
                "Unsupported file type. Upload a PDF or DOCX resume."
            )

    except ValueError:
        raise
    except Exception as exc:
        raise ValueError(
            "The resume could not be read. Check that the file is valid."
        ) from exc

    text = text.strip()

    if not text:
        raise ValueError(
            "No text could be extracted. The document may be scanned "
            "or contain no readable text."
        )

    return text