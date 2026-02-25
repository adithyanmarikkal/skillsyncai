import { useState } from "react";
import api from "../services/api";

const Roadmap = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!jobDesc) return;

    setLoading(true);
    try {
      const res = await api.post("/generate-roadmap", {
        job_description: jobDesc
      });

      setRoadmap(res.data.roadmap);
    } catch (e) {
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-2xl">
      <h2 className="text-2xl font-bold">Learning Roadmap</h2>

      <textarea
        className="w-full border p-3 rounded mt-3"
        rows={6}
        placeholder="Paste job description..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-3 bg-blue-700 text-white px-4 py-2 rounded"
      >
        Generate Roadmap
      </button>

      {loading && <p className="mt-3">Generating...</p>}

      {roadmap && (
        <pre className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {roadmap}
        </pre>
      )}
    </div>
  );
};

export default Roadmap;