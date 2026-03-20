import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState({
    name: "",
    description: "",
    htmlTemplate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/certificate-templates/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm({
          name: res.data.name,
          description: res.data.description,
          htmlTemplate: res.data.htmlTemplate,
        });
      } catch (err) {
        toast.error("Failed to load template.");
      }
    };
    fetchTemplate();
  }, [id, API_BASE_URL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.htmlTemplate) {
      return toast.error("Template name and HTML content are required.");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/certificate-templates/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Template updated successfully!");
      navigate("/admin/templates");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update template.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-20 lg:px-40 py-10">
      <h1 className="text-3xl font-bold text-sky-800 mb-6 text-center">
        Edit Certificate Template
      </h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Template Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
            <label className="block font-medium mb-1">HTML Template</label>
            <textarea
              name="htmlTemplate"
              value={form.htmlTemplate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              rows={12}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            {loading ? "Updating..." : "Update Template"}
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Live Preview</h3>
          <div className="border rounded-lg p-6 bg-white shadow max-h-[600px] overflow-auto">
            {form.htmlTemplate ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: form.htmlTemplate.replace(/{{\s*\w+\s*}}/g, "______"),
                }}
              />
            ) : (
              <p className="text-gray-400">Template preview will appear here.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
