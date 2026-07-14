const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Invitation = require("../models/Invitation");

const router = express.Router();

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

router.post("/", async (req, res, next) => {
  try {
    const { email, role = "Team Member", name = "" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await Invitation.create({ email, role, name, token, expiresAt });
    const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const invitationUrl = `${baseUrl}/accept-invitation.html?token=${token}`;

    const transporter = createTransporter();
    let emailSent = false;

    if (transporter) {
      await transporter.sendMail({
        from: `Waypoint Portal <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "You are invited to join the Waypoint team",
        text: `Hello ${name || "there"},\n\nYou were invited as ${role}.\nOpen this link to accept: ${invitationUrl}\n\nThis invitation expires in 7 days.`,
        html: `
          <h2>Waypoint Team Invitation</h2>
          <p>Hello ${name || "there"},</p>
          <p>You were invited to join the Waypoint team as <strong>${role}</strong>.</p>
          <p><a href="${invitationUrl}">Accept invitation</a></p>
          <p>This invitation expires in 7 days.</p>
        `,
      });
      emailSent = true;
    }

    res.status(201).json({
      message: emailSent
        ? "Invitation saved and email sent"
        : "Invitation saved, but email was not sent because email settings are missing",
      invitation,
      emailSent,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const invitations = await Invitation.find().sort({ createdAt: -1 });
    res.json(invitations);
  } catch (error) {
    next(error);
  }
});

router.get("/accept/:token", async (req, res, next) => {
  try {
    const invitation = await Invitation.findOne({ token: req.params.token });
    if (!invitation) return res.status(404).json({ message: "Invitation not found" });

    if (invitation.expiresAt < new Date()) {
      invitation.status = "Expired";
      await invitation.save();
      return res.status(410).json({ message: "Invitation has expired" });
    }

    invitation.status = "Accepted";
    await invitation.save();
    res.json({ message: "Invitation accepted", invitation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
