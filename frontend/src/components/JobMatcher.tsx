import { useState } from "react";
import api from "../services/api";

interface MatchResult {
  match_percentage: number;
  top_matches: { text: string; score: number }[];
}

const JobMatcher = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeJob = async () => {
    if (!jobDesc) return;

    setLoading(true);
    try {
      const res = await api.post("/match-job", {
        job_description: jobDesc,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 max-w-xl">
      <textarea
        className="w-full border p-3 rounded"
        rows={6}
        placeholder="Paste job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        onClick={analyzeJob}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Analyze Job Match
      </button>

      {loading && <p className="mt-2">Analyzing...</p>}

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl font-bold">
            Match Score: {result.match_percentage}%
          </h3>

          <h4 className="mt-3 font-semibold">Top Matching Resume Sections:</h4>

          {result.top_matches.map((m, i) => (
            <div key={i} className="mt-2 text-sm bg-gray-100 p-2 rounded">
              <p>{m.text.slice(0, 200)}...</p>
              <p className="text-gray-600">Score: {m.score.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatcher;