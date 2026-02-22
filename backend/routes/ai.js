const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/auth");

// Protect AI usage behind authentication to prevent quota abuse.
router.use(authMiddleware);

router.post("/generate-resume", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "AI service is not configured" });
    }

    const { role, experience, jobDescription } = req.body;

    if (!role || !jobDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a professional resume writer.

Generate resume content based on:

Role: ${role}
Experience: ${experience}

Job Description:
${jobDescription}

Return ONLY valid JSON:

{
  "summary": "",
  "skills": "comma separated skills",
  "experience": "",
  "education": ""
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let cleanJSON;
    try {
      cleanJSON = JSON.parse(cleaned);
    } catch (_parseError) {
      return res.status(502).json({ error: "AI returned invalid JSON format" });
    }

    res.json(cleanJSON);

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
