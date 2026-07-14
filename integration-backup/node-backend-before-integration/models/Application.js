const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicantEmail: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
