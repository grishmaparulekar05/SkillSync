import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  LoaderCircle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  X,
} from "lucide-react";

import { api } from "./lib/axios";

interface ScreeningResult {
  filename: string;
  extracted_text_length: number;
  matched_skills: string[];
  missing_skills: string[];
  match_score: number;
  explanation: string;
}

const DEFAULT_JOB_DESCRIPTION = `We are looking for a Python developer with experience in FastAPI,
PostgreSQL, SQL, Docker, machine learning, and REST API development.
The candidate should be able to build reliable backend services,
work with structured data, and contribute to scalable applications.`;

function getScoreLabel(score: number) {
  if (score >= 75) return "High skill overlap";
  if (score >= 45) return "Moderate skill overlap";
  return "Low skill overlap";
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobDescription, setJobDescription] = useState(
    DEFAULT_JOB_DESCRIPTION,
  );

  const [resume, setResume] = useState<File | null>(null);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setResult(null);
    setError("");

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["pdf", "docx"].includes(extension ?? "")) {
      setResume(null);
      setError("Please select a PDF or DOCX resume.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setResume(null);
      setError("The resume must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    setResume(selectedFile);
  }

  async function handleScreening(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!resume) {
      setError("Please upload a resume before starting screening.");
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError("Please enter a job description with at least 20 characters.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("job_description", jobDescription.trim());

    try {
      setLoading(true);

      const response = await api.post<ScreeningResult>(
        "/screen",
        formData,
      );

      setResult(response.data);

      window.setTimeout(() => {
        document
          .getElementById("screening-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const response = (
          err as {
            response?: {
              data?: { detail?: string };
            };
          }
        ).response;

        setError(
          response?.data?.detail ??
            "The screening request failed. Check that the backend is running.",
        );
      } else {
        setError(
          "Unable to connect to the backend. Check the API server and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function resetScreening() {
    setResume(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const score = result?.match_score ?? 0;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <ScanSearch size={22} />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight">
                Talent Intelligence
              </h1>
              <p className="text-xs text-slate-500">
                AI Resume Screening
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Screening workspace
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Hero */}
        <section className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <Sparkles size={14} />
            Intelligent recruitment workspace
          </div>

          <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Screen resumes with
            <span className="text-indigo-600"> greater clarity.</span>
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Compare a candidate&apos;s resume against job requirements,
            identify relevant skills, and review evidence-backed screening
            results in one workspace.
          </p>
        </section>

        {/* Overview cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            icon={<FileText size={19} />}
            label="Resume formats"
            value="PDF & DOCX"
            description="Text-based documents"
          />

          <OverviewCard
            icon={<Target size={19} />}
            label="Matching method"
            value="Skill overlap"
            description="Current screening engine"
          />

          <OverviewCard
            icon={<ShieldCheck size={19} />}
            label="Review approach"
            value="Human-led"
            description="Scores support review"
          />
        </section>

        {/* Main screening form */}
        <form onSubmit={handleScreening}>
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.95fr]">
            {/* Resume upload */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeading
                number="01"
                title="Upload candidate resume"
                subtitle="Choose a PDF or DOCX file to analyze."
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Choose resume file"
              />

              {!resume ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group mt-7 flex min-h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:scale-105">
                    <UploadCloud size={27} />
                  </div>

                  <span className="font-semibold text-slate-800">
                    Select a resume to upload
                  </span>

                  <span className="mt-2 text-sm text-slate-500">
                    PDF or DOCX · Maximum 10 MB
                  </span>

                  <span className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
                    Browse files
                  </span>
                </button>
              ) : (
                <div className="mt-7 rounded-xl border border-indigo-200 bg-indigo-50/60 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <FileText size={23} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-all font-semibold text-slate-800">
                        {resume.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {(resume.size / 1024).toFixed(1)} KB
                      </p>

                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        File selected
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetScreening}
                      aria-label="Remove selected resume"
                      className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                  >
                    Choose a different file
                  </button>
                </div>
              )}

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Upload resumes you are authorized to process. This prototype
                  does not provide persistent storage, and uploaded documents
                  are processed by the backend.
                </p>
              </div>
            </section>

            {/* Job description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeading
                number="02"
                title="Job requirements"
                subtitle="Provide the role description for comparison."
              />

              <label
                htmlFor="job-description"
                className="mt-7 block text-sm font-semibold text-slate-700"
              >
                Job description
              </label>

              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setResult(null);
                }}
                rows={11}
                maxLength={20000}
                placeholder="Describe the role, required skills, experience, and qualifications..."
                className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Include relevant, job-related requirements.</span>
                <span>{jobDescription.length}/20000</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={19} />
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <Sparkles size={19} />
                    Analyze candidate
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {loading && (
                <p
                  role="status"
                  className="mt-4 text-center text-sm text-slate-500"
                >
                  Extracting resume text and comparing recognized skills.
                </p>
              )}
            </section>
          </div>
        </form>

        {/* Errors */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Screening could not be completed</p>
              <p className="mt-1 leading-6">{error}</p>
            </div>
          </div>
        )}

        {/* Screening results */}
        {result && (
          <section
            id="screening-results"
            className="mt-10 scroll-mt-24"
            aria-live="polite"
          >
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={17} />
                  Screening completed
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                  Screening results
                </h2>

                <p className="mt-2 break-all text-sm text-slate-500">
                  Resume: {result.filename}
                </p>
              </div>

              <button
                type="button"
                onClick={resetScreening}
                className="self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:self-auto"
              >
                New screening
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              {/* Score card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Recognized skill overlap
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      {getScoreLabel(score)}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Target size={23} />
                  </div>
                </div>

                <div className="my-8 flex justify-center">
                  <div
                    className="relative flex h-48 w-48 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#4f46e5 ${score}%, #e8edf5 ${score}% 100%)`,
                    }}
                    role="img"
                    aria-label={`Skill overlap score: ${score} percent`}
                  >
                    <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-5xl font-bold tracking-tight">
                        {score.toFixed(1)}
                      </span>

                      <span className="mt-1 text-sm font-medium text-slate-500">
                        out of 100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Activity size={17} />
                    Extraction summary
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {result.extracted_text_length.toLocaleString()} characters
                    extracted from the resume.
                  </p>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  This score represents overlap among skills recognized by the
                  current keyword-based extractor. It is not a probability of
                  job success or an overall measure of candidate suitability.
                </p>
              </div>

              {/* Skills evidence */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">Matched skills</h3>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {result.matched_skills.length} found
                    </span>
                  </div>

                  {result.matched_skills.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {result.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                        >
                          <CheckCircle2 size={14} />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      No recognized matching skills were found.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">Skills without matching evidence</h3>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                      {result.missing_skills.length} to review
                    </span>
                  </div>

                  {result.missing_skills.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {result.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      All recognized job-description skills were found in the
                      extracted resume text.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
                  <div className="flex items-center gap-2 font-bold text-indigo-950">
                    <Sparkles size={19} />
                    Screening explanation
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              <strong className="text-slate-800">Human review required:</strong>{" "}
              Use these results to guide further assessment. Missing extracted
              evidence does not establish that a candidate lacks a skill.
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 py-6">
          <p className="text-center text-xs leading-5 text-slate-500">
            AI Resume Screening Agent · Resume analysis and job-related
            decision support · Human review required
          </p>
        </footer>
      </main>
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <p className="text-sm text-slate-500">{label}</p>
      </div>

      <h3 className="mt-4 text-xl font-bold">{value}</h3>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </article>
  );
}

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
        {number}
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}