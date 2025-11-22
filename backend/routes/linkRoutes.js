import express from "express";
import {
  createShortLink,
  redirectToUrl,
  getAllLinks,
  getLinkByCode,
  deleteLink
} from "../controllers/linkController.js";

const router = express.Router();

// Health check endpoint
router.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes (must be /api/links as per assignment)
router.post("/api/links", createShortLink);
router.get("/api/links", getAllLinks);
router.get("/api/links/:code", getLinkByCode);
router.delete("/api/links/:code", deleteLink);

// Redirect route (must be last to avoid conflicts)
router.get("/:code", redirectToUrl);

export default router;