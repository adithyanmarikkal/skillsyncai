import { useState } from "react";
import api from "../services/api";

interface MatchedSkill {
  skill: string;
  similarity: number;
}

const GapAnalysis = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [matched, setMatched] = useState<MatchedSkill[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeGap = async () => {
    if (!jobDesc) return;

    setLoading(true);

    try {
      const res = await api.post("/semantic-gap", {
        job_description: jobDesc,
      });

      setMatched(res.data.matched);
      setMissing(res.data.missing);
    } catch (err) {
      console.error(err);
      alert("Gap analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-2xl">
      <h2 className="text-2xl font-bold mb-3">Skill Gap Analysis</h2>

      <textarea
        className="w-full border p-3 rounded"
        rows={6}
        placeholder="Paste job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        onClick={analyzeGap}
        className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Analyze Skills
      </button>

      {loading && <p className="mt-3">Analyzing...</p>}

      {/* Matched Skills */}
      {matched.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-green-700">Matched Skills</h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {matched.map((m, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {m.skill} ({Math.round(m.similarity * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missing.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-red-700">Missing Skills</h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {missing.map((skill, i) => (
              <span
                key={i}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GapAnalysis;