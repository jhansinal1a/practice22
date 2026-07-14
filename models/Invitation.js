const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    role: { type: String, default: "Team Member" },
    token: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Pending", "Accepted", "Expired", "Cancelled"], default: "Pending" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invitation", invitationSchema);
