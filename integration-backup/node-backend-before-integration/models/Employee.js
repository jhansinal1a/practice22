const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    profileSummary: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
