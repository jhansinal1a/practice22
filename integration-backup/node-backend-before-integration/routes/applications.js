const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const application = await Application.create(req.body);
    const populated = await application.populate([
      { path: "job", select: "jobId title" },
      { path: "employee", select: "fullName email" },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.job) filter.job = req.query.job;
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;

    const applications = await Application.find(filter)
      .populate("job", "jobId title employer")
      .populate("employee", "fullName email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job", "jobId title employer")
      .populate("employee", "fullName email");
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
