import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateTemplate() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState({
    name: "",
    description: "",
    htmlTemplate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.htmlTemplate) {
      return setError("Template name and HTML content are required.");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/api/certificate-templates`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Template created successfully.")
      navigate("/admin/templates");
    } catch (err) {
      const mzg = err.response?.data?.message || "Failed to create template.";
      setError(mzg);
      toast.error(mzg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-20 lg:px-40 py-10">
      <h1 className="text-3xl font-bold text-sky-800 mb-6 text-center">
        Create Certificate Template
      </h1>

      {error && (
        <p className="text-center text-red-600 mb-4 font-medium">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-8"
      >
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Template Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Volunteer Appreciation Certificate"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              HTML Template
            </label>
            <textarea
              name="htmlTemplate"
              value={form.htmlTemplate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              rows={12}
              placeholder={`<div style="text-align:center">
                <h1>Certificate of Appreciation</h1>
                <p>This certifies that <strong>{{volunteerName}}</strong></p>
                <p>participated in {{eventName}}</p>
                </div>`}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            {loading ? "Creating..." : "Create Template"}
          </button>
        </div>


        <div>
          <h3 className="font-semibold mb-2 text-gray-700">
            Live Preview
          </h3>
          <div className="border rounded-lg p-6 bg-white shadow max-h-[600px] overflow-auto">
            {form.htmlTemplate ? (
                <div
                dangerouslySetInnerHTML={{
                    __html: form.htmlTemplate.replace(/{{\s*\w+\s*}}/g, "______"),
                }}
                />
            ) : (
                <p className="text-gray-400">
                Template preview will appear here.
                </p>
            )}
        </div>

        </div>
      </form>
    </div>
  );
}
