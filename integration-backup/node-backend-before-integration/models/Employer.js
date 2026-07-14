const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, lowercase: true, trim: true, required: true },
    role: { type: String, trim: true, default: "Member" },
    status: { type: String, enum: ["Invited", "Active", "Inactive"], default: "Invited" },
  },
  { _id: false }
);

const employerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    teamMembers: [teamMemberSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
