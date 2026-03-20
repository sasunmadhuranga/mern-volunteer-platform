import CertificateTemplate from "../models/CertificateTemplate.js";

export const createTemplate = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const template = await CertificateTemplate.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await CertificateTemplate.find()
      .sort({ createdAt: -1 });

    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActiveTemplates = async (req, res) => {
  try {
    const templates = await CertificateTemplate.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Not found" });

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const updated = await CertificateTemplate.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Template not found or inactive" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access only" });
    }

    await CertificateTemplate.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.json({ message: "Template deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


