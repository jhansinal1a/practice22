const express = require("express");
const Employer = require("../models/Employer");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const employer = await Employer.create(req.body);
    res.status(201).json(employer);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const employers = await Employer.find().sort({ createdAt: -1 });
    res.json(employers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: "Employer not found" });
    res.json(employer);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employer) return res.status(404).json({ message: "Employer not found" });
    res.json(employer);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) return res.status(404).json({ message: "Employer not found" });
    res.json({ message: "Employer deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
