import { useState } from "react";
import api from "../services/api";

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await api.post("/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadResume}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
      >
        Upload Resume
      </button>
    </div>
  );
};

export default ResumeUpload;