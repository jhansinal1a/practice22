require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./db");

const employeeRoutes = require("./routes/employees");
const employerRoutes = require("./routes/employers");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const eventRoutes = require("./routes/events");
const invitationRoutes = require("./routes/invitations");
const contactRoutes = require("./routes/contact");
const uploadRoutes = require("./routes/uploads");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Existing frontend files stay inside the project's public folder.
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    message: "Waypoint Portal backend is running",
    database: states[mongoose.connection.readyState] || "unknown",
  });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/invite", invitationRoutes); // Compatibility with an existing Invite Team button.
app.use("/api/contact", contactRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  next();
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A record with that unique value already exists.",
      fields: error.keyValue,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Waypoint Portal running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error.message);
    process.exit(1);
  }
}

startServer();
