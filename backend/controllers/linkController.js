import pkg from "pg";
import dotenv from "dotenv";
import { generateCode } from "../utils/generateCode.js";
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// URL Validation function
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Validate short code format: [A-Za-z0-9]{6,8}
const isValidCode = (code) => {
  const regex = /^[A-Za-z0-9]{6,8}$/;
  return regex.test(code);
};

// ➤ Create short URL
export const createShortLink = async (req, res) => {
  try {
    const { url, customCode } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ 
        error: "Invalid URL. Please provide a valid HTTP/HTTPS URL." 
      });
    }

    let shortCode;

    // If custom code provided, validate and check uniqueness
    if (customCode) {
      // Validate custom code format
      if (!isValidCode(customCode)) {
        return res.status(400).json({ 
          error: "Invalid code format. Code must be 6-8 alphanumeric characters." 
        });
      }

      // Check if code already exists
      const existing = await pool.query(
        "SELECT * FROM links WHERE short_code = $1",
        [customCode]
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({ 
          error: "Code already exists. Please choose a different code." 
        });
      }

      shortCode = customCode;
    } else {
      // Generate random code
      shortCode = generateCode();
      
      // Ensure generated code is unique
      let exists = true;
      while (exists) {
        const check = await pool.query(
          "SELECT * FROM links WHERE short_code = $1",
          [shortCode]
        );
        if (check.rows.length === 0) {
          exists = false;
        } else {
          shortCode = generateCode();
        }
      }
    }

    const result = await pool.query(
      "INSERT INTO links (original_url, short_code) VALUES ($1, $2) RETURNING *",
      [url, shortCode]
    );

    res.status(201).json({
      message: "URL shortened successfully",
      data: result.rows[0],
      shortUrl: `${process.env.BASE_URL}/${shortCode}`
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➤ Redirect + count clicks
export const redirectToUrl = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT * FROM links WHERE short_code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    const now = new Date();

    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = $1 WHERE short_code = $2",
      [now, code]
    );

    // 302 redirect as per assignment
    res.redirect(302, result.rows[0].original_url);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➤ Get all links
export const getAllLinks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ Get single link stats
export const getLinkByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT * FROM links WHERE short_code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ Delete short URL
export const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "DELETE FROM links WHERE short_code = $1 RETURNING *",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};