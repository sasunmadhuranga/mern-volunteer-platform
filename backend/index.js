import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from "./routes/eventRoutes.js";
import eventApplicationRoutes from "./routes/eventApplicationRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.use("/api/events", eventRoutes);
app.use("/api/event-applications", eventApplicationRoutes)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
