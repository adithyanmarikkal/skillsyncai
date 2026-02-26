import { useState, useRef } from "react";
import api from "../services/api";

interface MatchedSkill {
    skill: string;
    similarity: number;
}

interface AnalysisResult {
    match_score: number;
    matched_skills: MatchedSkill[];
    missing_skills: string[];
    roadmap: any;
}

/* ─── tiny inline styles (no Tailwind dependency for custom props) ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    display: block;
  }

  .dash-root {
    min-height: 100vh;
    background: radial-gradient(ellipse at 20% 20%, #1a0533 0%, #0a0a0f 50%, #001a33 100%);
    padding: 40px 16px 80px;
  }

  /* ─── header ─── */
  .dash-header {
    text-align: center;
    margin-bottom: 48px;
  }
  .dash-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .dash-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .dash-logo-text {
    font-size: 1.6rem; font-weight: 800;
    background: linear-gradient(90deg, #a78bfa, #38bdf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .dash-subtitle {
    color: #6b7280; font-size: 0.95rem; margin-top: 4px;
  }

  /* ─── glass card ─── */
  .glass {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    backdrop-filter: blur(16px);
  }

  /* ─── steps ─── */
  .steps-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 36px;
  }
  .step-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 0.85rem; font-weight: 600;
    transition: all 0.3s;
  }
  .step-pill.active {
    background: linear-gradient(135deg, #7c3aed33, #06b6d433);
    border: 1px solid #7c3aed88;
    color: #c4b5fd;
  }
  .step-pill.done {
    background: #052e16;
    border: 1px solid #16a34a55;
    color: #4ade80;
  }
  .step-pill.inactive {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    color: #4b5563;
  }
  .step-dot {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700;
  }
  .step-pill.active .step-dot   { background: #7c3aed; color: #fff; }
  .step-pill.done .step-dot     { background: #16a34a; color: #fff; }
  .step-pill.inactive .step-dot { background: #1f2937; color: #6b7280; }
  .step-divider { width: 40px; height: 1px; background: #1f2937; }

  /* ─── upload zone ─── */
  .max-w-2xl { max-width: 680px; margin: 0 auto; }
  .max-w-5xl { max-width: 1100px; margin: 0 auto; }

  .upload-zone {
    border: 2px dashed rgba(124,58,237,0.35);
    border-radius: 16px;
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: #7c3aed; background: rgba(124,58,237,0.06); }
  .upload-zone input { position: absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
  .upload-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .upload-label { color: #9ca3af; font-size: 0.9rem; margin-top: 6px; }
  .upload-name { color: #a78bfa; font-weight: 600; font-size: 0.9rem; margin-top: 8px; }

  /* ─── textarea ─── */
  .job-textarea {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    color: #e5e7eb;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    padding: 16px;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    min-height: 140px;
  }
  .job-textarea:focus { border-color: #7c3aed; }
  .job-textarea::placeholder { color: #4b5563; }

  /* ─── buttons ─── */
  .btn-primary {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-size: 1rem; font-weight: 700;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    color: #fff;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 4px 24px rgba(124,58,237,0.35);
  }
  .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-secondary {
    padding: 10px 22px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer;
    font-size: 0.85rem; font-weight: 600;
    font-family: 'Inter', sans-serif;
    background: rgba(255,255,255,0.05);
    color: #9ca3af;
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: #7c3aed; color: #c4b5fd; }

  /* ─── loading pulse ─── */
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .loading-row { display:flex; align-items:center; gap:10px; color:#9ca3af; font-size:0.9rem; margin-top:16px; }
  .loading-dots span { display:inline-block; width:7px; height:7px; border-radius:50%; background:#7c3aed; margin:0 2px; animation: pulse 1.2s ease-in-out infinite; }
  .loading-dots span:nth-child(2){animation-delay:0.2s}
  .loading-dots span:nth-child(3){animation-delay:0.4s}

  /* ─── score ring ─── */
  .score-ring-wrap { position:relative; width:140px; height:140px; flex-shrink:0; }
  .score-ring-svg { transform: rotate(-90deg); }
  .score-ring-track { fill:none; stroke:rgba(255,255,255,0.06); stroke-width:10; }
  .score-ring-fill  { fill:none; stroke-width:10; stroke-linecap:round; transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1); }
  .score-ring-label {
    position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center;
  }
  .score-number { font-size:2.2rem; font-weight:800; line-height:1; }
  .score-unit   { font-size:0.75rem; color:#6b7280; margin-top:2px; }

  /* ─── result grid ─── */
  .result-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media(max-width:640px){ .result-grid{grid-template-columns:1fr;} }

  .section-title {
    display:flex; align-items:center; gap:8px;
    font-size:0.9rem; font-weight:700; text-transform:uppercase;
    letter-spacing:0.8px; margin-bottom:14px;
  }
  .section-icon { font-size:1.1rem; }

  /* ─── skill pills ─── */
  .pill-grid { display:flex; flex-wrap:wrap; gap:8px; }
  .pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 12px; border-radius:999px;
    font-size:0.78rem; font-weight:600; letter-spacing:0.2px;
  }
  .pill-green { background:rgba(22,163,74,0.15); border:1px solid rgba(22,163,74,0.3); color:#4ade80; }
  .pill-red   { background:rgba(220,38,38,0.12); border:1px solid rgba(220,38,38,0.25); color:#f87171; }
  .pill-pct   { font-size:0.7rem; opacity:0.7; }

  /* ─── roadmap ─── */
  .roadmap-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 18px 20px;
    color: #d1d5db;
    font-size: 0.875rem;
    line-height: 1.75;
    white-space: pre-wrap;
    font-family: 'Inter', sans-serif;
  }

  /* ─── info label ─── */
  .info-label { display:flex; align-items:center; gap:6px; font-size:0.85rem; color:#6b7280; margin-bottom:8px; }
  .info-label strong { color:#9ca3af; }
`;

/* ─── Score Ring Component ─── */
const ScoreRing = ({ score }: { score: number }) => {
    const r = 56;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color =
        score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

    return (
        <div className="score-ring-wrap">
            <svg className="score-ring-svg" width="140" height="140" viewBox="0 0 140 140">
                <circle className="score-ring-track" cx="70" cy="70" r={r} />
                <circle
                    className="score-ring-fill"
                    cx="70" cy="70" r={r}
                    stroke={color}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="score-ring-label">
                <span className="score-number" style={{ color }}>{score}</span>
                <span className="score-unit">match %</span>
            </div>
        </div>
    );
};

/* ─── Main Dashboard ─── */
const AnalyzeDashboard = () => {
    const [step, setStep] = useState<"upload" | "analyze">("upload");
    const [file, setFile] = useState<File | null>(null);
    const [uploadDone, setUploadDone] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [drag, setDrag] = useState(false);

    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── upload handler ── */
    const handleUpload = async () => {
        if (!file) return;
        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            await api.post("/upload-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadDone(true);
            setStep("analyze");
        } catch (err) {
            console.error(err);
            alert("Resume upload failed. Please try again.");
        } finally {
            setUploadLoading(false);
        }
    };

    /* ── analyze handler ── */
    const handleAnalyze = async () => {
        if (!jobDesc.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await api.post("/analyze", { job_description: jobDesc });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Analysis failed. Make sure your resume is uploaded and the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = result
        ? result.match_score >= 75
            ? "#4ade80"
            : result.match_score >= 50
                ? "#facc15"
                : "#f87171"
        : "#fff";

    return (
        <>
            <style>{css}</style>
            <div className="dash-root">

                {/* ── Header ── */}
                <header className="dash-header">
                    <div className="dash-logo">
                        <div className="dash-logo-icon">⚡</div>
                        <span className="dash-logo-text">SkillSync AI</span>
                    </div>
                    <p className="dash-subtitle">
                        Upload your resume · paste a job description · get instant insights
                    </p>
                </header>

                {/* ── Step Pills ── */}
                <div className="steps-row">
                    <div className={`step-pill ${uploadDone ? "done" : step === "upload" ? "active" : "inactive"}`}>
                        <div className="step-dot">{uploadDone ? "✓" : "1"}</div>
                        Upload Resume
                    </div>
                    <div className="step-divider" />
                    <div className={`step-pill ${result ? "done" : step === "analyze" ? "active" : "inactive"}`}>
                        <div className="step-dot">{result ? "✓" : "2"}</div>
                        Analyze Job
                    </div>
                    <div className="step-divider" />
                    <div className={`step-pill ${result ? "active" : "inactive"}`}>
                        <div className="step-dot">3</div>
                        View Results
                    </div>
                </div>

                {/* ══════════════ STEP 1 — Upload Resume ══════════════ */}
                {step === "upload" && (
                    <div className="max-w-2xl">
                        <div className="glass" style={{ padding: "32px" }}>
                            <div className="section-title" style={{ color: "#c4b5fd", marginBottom: "20px" }}>
                                <span className="section-icon">📄</span> Step 1 — Upload Your Resume
                            </div>

                            <div
                                className={`upload-zone${drag ? " drag" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                                onDragLeave={() => setDrag(false)}
                                onDrop={(e) => {
                                    e.preventDefault(); setDrag(false);
                                    const f = e.dataTransfer.files[0];
                                    if (f && f.type === "application/pdf") setFile(f);
                                }}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <div className="upload-icon">📂</div>
                                <p style={{ color: "#9ca3af", fontWeight: 600 }}>
                                    Drag & drop your PDF resume here
                                </p>
                                <p className="upload-label">or click to browse files</p>
                                {file && <p className="upload-name">✓ {file.name}</p>}
                            </div>

                            <button
                                className="btn-primary"
                                style={{ marginTop: "20px" }}
                                onClick={handleUpload}
                                disabled={!file || uploadLoading}
                            >
                                {uploadLoading ? "Uploading…" : "Upload Resume →"}
                            </button>

                            {uploadLoading && (
                                <div className="loading-row" style={{ justifyContent: "center" }}>
                                    <div className="loading-dots">
                                        <span /><span /><span />
                                    </div>
                                    Processing your resume…
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ══════════════ STEP 2 — Analyze ══════════════ */}
                {step === "analyze" && !result && (
                    <div className="max-w-2xl">
                        <div className="glass" style={{ padding: "32px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <div className="section-title" style={{ color: "#c4b5fd", marginBottom: 0 }}>
                                    <span className="section-icon">🔍</span> Step 2 — Paste Job Description
                                </div>
                                <button className="btn-secondary" onClick={() => setStep("upload")}>← Re-upload</button>
                            </div>

                            <div className="info-label">
                                <span>📋</span> <strong>Resume uploaded:</strong> {file?.name}
                            </div>

                            <textarea
                                className="job-textarea"
                                rows={8}
                                placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications for the best match…"
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                            />

                            <button
                                className="btn-primary"
                                style={{ marginTop: "16px" }}
                                onClick={handleAnalyze}
                                disabled={!jobDesc.trim() || loading}
                            >
                                {loading ? "Analyzing…" : "⚡ Compare & Analyze"}
                            </button>

                            {loading && (
                                <div className="loading-row" style={{ justifyContent: "center" }}>
                                    <div className="loading-dots">
                                        <span /><span /><span />
                                    </div>
                                    Running AI analysis — this may take a moment…
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ══════════════ STEP 3 — Results ══════════════ */}
                {result && (
                    <div className="max-w-5xl">

                        {/* ─ Score Hero ─ */}
                        <div className="glass" style={{ padding: "28px 32px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
                            <ScoreRing score={result.match_score} />
                            <div style={{ flex: 1 }}>
                                <p style={{ color: "#6b7280", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                                    Overall Match Score
                                </p>
                                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: scoreColor, lineHeight: 1.2, marginTop: "4px" }}>
                                    {result.match_score >= 75
                                        ? "Strong Match 🚀"
                                        : result.match_score >= 50
                                            ? "Moderate Match 🎯"
                                            : "Needs Work 📈"}
                                </h2>
                                <p style={{ color: "#9ca3af", fontSize: "0.88rem", marginTop: "6px", maxWidth: "480px" }}>
                                    {result.match_score >= 75
                                        ? "Your resume aligns well with this role. Focus on filling any highlighted gaps to stand out further."
                                        : result.match_score >= 50
                                            ? "You meet several requirements. Upskilling in the missing areas could significantly boost your chances."
                                            : "There are meaningful skill gaps. Use the roadmap below to build the skills this role demands."}
                                </p>
                            </div>
                            <button
                                className="btn-secondary"
                                onClick={() => { setResult(null); setStep("analyze"); }}
                            >
                                ← New Analysis
                            </button>
                        </div>

                        {/* ─ Skills Grid ─ */}
                        <div className="result-grid" style={{ marginBottom: "20px" }}>
                            {/* Matched */}
                            <div className="glass" style={{ padding: "24px" }}>
                                <div className="section-title" style={{ color: "#4ade80" }}>
                                    <span className="section-icon">✅</span>
                                    Matched Skills
                                    <span style={{ marginLeft: "auto", background: "rgba(22,163,74,0.2)", color: "#4ade80", borderRadius: "999px", padding: "2px 10px", fontSize: "0.75rem" }}>
                                        {result.matched_skills.length}
                                    </span>
                                </div>
                                <div className="pill-grid">
                                    {result.matched_skills.length > 0
                                        ? result.matched_skills.map((s, i) => (
                                            <span key={i} className="pill pill-green">
                                                {s.skill}
                                                {s.similarity !== undefined && (
                                                    <span className="pill-pct">{Math.round(s.similarity * 100)}%</span>
                                                )}
                                            </span>
                                        ))
                                        : <p style={{ color: "#4b5563", fontSize: "0.85rem" }}>No matched skills found.</p>}
                                </div>
                            </div>

                            {/* Missing */}
                            <div className="glass" style={{ padding: "24px" }}>
                                <div className="section-title" style={{ color: "#f87171" }}>
                                    <span className="section-icon">⚠️</span>
                                    Missing Skills
                                    <span style={{ marginLeft: "auto", background: "rgba(220,38,38,0.2)", color: "#f87171", borderRadius: "999px", padding: "2px 10px", fontSize: "0.75rem" }}>
                                        {result.missing_skills.length}
                                    </span>
                                </div>
                                <div className="pill-grid">
                                    {result.missing_skills.length > 0
                                        ? result.missing_skills.map((s, i) => (
                                            <span key={i} className="pill pill-red">{s}</span>
                                        ))
                                        : <p style={{ color: "#4b5563", fontSize: "0.85rem" }}>No skill gaps identified — great!</p>}
                                </div>
                            </div>
                        </div>

                        {/* ─ Roadmap ─ */}
                        {result.roadmap && (
                            <div className="glass" style={{ padding: "28px 32px" }}>
                                <div className="section-title" style={{ color: "#38bdf8", marginBottom: "18px" }}>
                                    <span className="section-icon">🗺️</span>
                                    Personalised Learning Roadmap
                                </div>
                                <div className="roadmap-box">
                                    {typeof result.roadmap === "string"
                                        ? result.roadmap
                                        : JSON.stringify(result.roadmap, null, 2)}
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </>
    );
};

export default AnalyzeDashboard;
