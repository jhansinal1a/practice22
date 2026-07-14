const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const uploadDirectory = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) return callback(null, true);
    const error = new Error("Only PDF, DOC, and DOCX resume files are allowed");
    error.status = 400;
    callback(error);
  },
});

router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });

  const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
  res.status(201).json({
    message: "Resume uploaded",
    filename: req.file.filename,
    fileUrl: `${baseUrl}/uploads/resumes/${req.file.filename}`,
  });
});

module.exports = router;
