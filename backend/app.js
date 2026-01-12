import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventApplicationRoutes from "./routes/eventApplicationRoutes.js";
import eventQRRoutes from "./routes/eventQRRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import certificateTemplateRoutes from "./routes/certificateTemplateRoutes.js";
import certificateTemplatePublicRoutes from "./routes/certificateTemplatePublicRoutes.js";
import setTemplateRoutes from "./routes/orgSetTemplateRoutes.js";
import certificateRoutes from "./routes/volunteerCertificateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/events", eventRoutes);
app.use("/api/events", eventQRRoutes);
app.use("/api/event-applications", eventApplicationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificate-templates", certificateTemplatePublicRoutes);
app.use("/api/certificate-templates", certificateTemplateRoutes);
app.use("/api/orgtemplate", setTemplateRoutes);
app.use("/api/certificates", certificateRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


export default app;
