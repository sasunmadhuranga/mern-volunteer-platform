import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SelectTemplate() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [orgTemplate, setOrgTemplate] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE_URL}/api/certificate-templates/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTemplates(res.data))
      .catch(() => toast.error("Failed to fetch templates"));

    axios.get(`${API_BASE_URL}/api/orgtemplate/current`, {
      headers: { Authorization: `Bearer ${token}`},
    })
    .then((res) => {
      if(res.data) setOrgTemplate(res.data);
    })
    .catch(() => {});
  }, [API_BASE_URL, token]);

  const handleTemplateSelect = (id) => {
    const template = templates.find((t) => t._id === id);
    setSelectedTemplate(template);
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return toast.error("Select a template first");
    if(!signatureFile) return toast.error("Signature is required to set a template");

    const formData = new FormData();
    formData.append("templateId", selectedTemplate._id);
    if (signatureFile) formData.append("signature", signatureFile);

    try {
      await axios.post(`${API_BASE_URL}/api/orgtemplate/select-template`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      toast.success("Template selected successfully");
    } catch (err) {
      toast.error("Failed to select template");
    }
  };

  return (
    <div className="flex justify-center py-8 px-4 bg-sky-100">
    <div className="w-full max-w-4xl">
      {orgTemplate && (
        <div>
          <h2 className="font-semibold mb-2 text-gray-700">Current Template</h2>
          <div className="border rounded p-3 bg-white shadow max-h-[250px] overflow-auto mb-4">
            <h3 className="font-semibold mb-2 text-gray-700 text-sm">{orgTemplate.templateId.name} Preview</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: orgTemplate.templateId.htmlTemplate
                  .replace(/{{\s*\w+\s*}}/g, "______")
                  .replace(
                    /{{signature}}/g,
                    orgTemplate.signature
                      ? `<img src="${API_BASE_URL}${orgTemplate.signature}" style="max-height:30px;" />`
                      : ""
                  ),
              }}
            />
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Select Template</h2>

      {/* Template Select */}
      <select
        className="border rounded px-3 py-2 mb-4 w-full"
        onChange={(e) => handleTemplateSelect(e.target.value)}
        value={selectedTemplate?._id || ""}
        disabled={!!orgTemplate}
      >
        <option value="">-- Select Template --</option>
        {templates.map((t) => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>

      {/* Signature Upload */}
      <div className="mb-4">
        <label className="block mb-1">Upload Signature:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignatureFile(e.target.files[0])}
          disabled={!!orgTemplate}
        />
      </div>

      {/* Live Preview */}
      {selectedTemplate && (
        <div className="border rounded p-3 bg-white shadow max-h-[250px] overflow-auto mb-4">
          <h3 className="font-semibold mb-2 text-gray-700 text-sm">{selectedTemplate.name} Preview</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedTemplate.htmlTemplate
                .replace(/{{\s*\w+\s*}}/g, "______")
                .replace(
                  /{{signature}}/g,
                  signatureFile
                    ? `<img src="${URL.createObjectURL(signatureFile)}" style="max-height:30px" />`
                    : ""
                ),
            }}
          />
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedTemplate || !signatureFile || !!orgTemplate}
        className={`py-2 px-4 rounded text-white text-sm ${
          !selectedTemplate || !signatureFile || !!orgTemplate
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Save
      </button>
    </div>
</div>
  );
}
