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
import organizationRoutes from "./routes/organizationRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-volunteer-platform.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
app.use("/api/organizations", organizationRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


export default app;
