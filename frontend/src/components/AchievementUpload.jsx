// AchievementUpload.jsx
import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";

const CATEGORY_OPTIONS = [
  { value: "conference", label: "Conference" },
  { value: "certification", label: "Certification" },
  { value: "internship", label: "Internship" },
  { value: "competition", label: "Competition" },
];

export default function AchievementUpload({ open, onClose, onUpload }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("proof", file);
    formData.append("category", category);
    const token = localStorage.getItem("token");
    console.log(token);

    const response = await axios.post(
      "/api/activity/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLoading(false);
    onUpload && onUpload(response.data.activity);
    onClose();
  } catch (err) {
    setLoading(false);
    alert(err.response?.data?.message || "Upload failed");
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Upload size={20} className="mr-2" />
          Upload Achievement
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Hackathon Winner"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
              placeholder="Describe your achievement..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate / Proof (Image)
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              required
            />
            {file && (
              <div className="mt-2 text-xs text-gray-600">
                Selected: {file.name}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Uploading..." : <><Upload size={16} className="mr-2" /> Upload</>}
          </button>
        </form>
      </div>
    </div>
  );
}