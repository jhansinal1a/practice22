const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    eventType: { type: String, trim: true, default: "Others" },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    eventMode: { type: String, enum: ["In Person", "Online"], default: "In Person" },
    location: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    description: { type: String, default: "" },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
