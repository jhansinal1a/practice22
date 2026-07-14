const mongoose = require("mongoose");

function createJobId() {
  return `JOB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      unique: true,
      trim: true,
      default: createJobId,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    workType: {
      type: String,
      enum: ["Onsite", "Remote", "Fully Remote", "Hybrid"],
      default: "Onsite",
    },

    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Temporary",
      ],
      default: "Full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["", "Entry", "Mid", "Senior"],
      default: "",
    },

    salaryMin: {
      type: Number,
      min: 0,
      default: null,
    },

    salaryMax: {
      type: Number,
      min: 0,
      default: null,
    },

    // Kept for compatibility with older records.
    salary: {
      type: String,
      default: "",
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    applicationDeadline: {
      type: Date,
      default: null,
    },

    resumeRequired: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Open", "Closed"],
      default: "Open",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
