import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModel from "../components/ConfirmationModel";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Not authorized. Please login again.");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/certificate-templates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setTemplates(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load templates.");
      });
  }, [API_BASE_URL, token]);

  const handleDeactivate = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/certificate-templates/${selectedTemplateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTemplates(prev =>
        prev.map(t =>
          t._id === selectedTemplateId ? { ...t, isActive: false } : t
        )
      );
      setShowModel(false);
    } catch {
      setError("Failed to deactivate template.");
    }
  };

  const handleActionClick = (id) => {
    setSelectedTemplateId(id);
    setShowModel(true);
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="md:px-20 lg:px-40 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-sky-800">
          Certificate Templates
        </h2>

        <Link
          to="/admin/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <p className="text-center text-gray-500">No templates found.</p>
      ) : (
        <div className="space-y-6">
          {templates.map(t => (
            <div
              key={t._id}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t.name}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                Status:
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold
                  ${t.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"}`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </span>
              </p>

              <div className="flex justify-end gap-4 mt-4">
                <Link
                  to={`/admin/edit/${t._id}`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  ✏ Edit
                </Link>

                {t.isActive && (
                  <button
                    onClick={() => handleActionClick(t._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModel && (
        <ConfirmationModel
            message="Are you sure you want to deactivate this template?"
            onConfirm={async () => {
            try {
                await axios.delete(
                `${API_BASE_URL}/api/certificate-templates/${selectedTemplateId}`,
                { headers: { Authorization: `Bearer ${token}` } }
                );

                // Update local state to mark template as inactive
                setTemplates(prev =>
                prev.map(t =>
                    t._id === selectedTemplateId ? { ...t, isActive: false } : t
                )
                );

                toast.success("Template deactivated successfully");
                setShowModel(false);
            } catch (err) {
                toast.error("Failed to deactivate template");
            }
            }}
            onCancel={() => setShowModel(false)}
        />
        )}
    </div>
  );
}
