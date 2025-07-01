const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Replace this with the actual Convex deployment function
async function uploadToConvex(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const form = new FormData();
  form.append("file", fileStream);

  // 🔥 Upload to Convex
  const response = await axios.post(
    "https://accomplished-cuttlefish-95.convex.cloud/upload", // Replace with your Convex upload endpoint
    form,
    { headers: form.getHeaders() }
  );

  // Convex should return a public URL to the file
  return response.data.publicUrl;
}

// Your profile match logic
const profiles = {
  mobile: {
    requiredSkills: [
      "swift",
      "kotlin",
      "flutter",
      "react native",
      "mobile ui",
      "rest api",
      "firebase",
    ],
    requiredMatchPercentage: 70,
    description: "Mobile App Developer",
  },
  cloud: {
    requiredSkills: [
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "terraform",
      "ci/cd",
    ],
    requiredMatchPercentage: 65,
    description: "Cloud Developer",
  },
  frontend: {
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "react",
      "angular",
      "vue",
      "responsive design",
    ],
    requiredMatchPercentage: 75,
    description: "Frontend Developer",
  },
  backend: {
    requiredSkills: [
      "node.js",
      "python",
      "java",
      "spring",
      "rest",
      "graphql",
      "microservices",
    ],
    requiredMatchPercentage: 70,
    description: "Backend Developer",
  },
  fullstack: {
    requiredSkills: [
      "javascript",
      "react",
      "node.js",
      "express",
      "database",
      "rest api",
      "html/css",
    ],
    requiredMatchPercentage: 80,
    description: "Full Stack Developer",
  },
  database: {
    requiredSkills: [
      "sql",
      "postgresql",
      "mysql",
      "mongodb",
      "database design",
      "etl",
      "query optimization",
    ],
    requiredMatchPercentage: 85,
    description: "Database Manager",
  },
  ai: {
    requiredSkills: [
      "python",
      "tensorflow",
      "pytorch",
      "machine learning",
      "deep learning",
      "nlp",
      "computer vision",
    ],
    requiredMatchPercentage: 75,
    description: "AI Engineer",
  },
  datascience: {
    requiredSkills: [
      "python",
      "r",
      "pandas",
      "numpy",
      "data analysis",
      "statistics",
      "data visualization",
    ],
    requiredMatchPercentage: 70,
    description: "Data Scientist",
  },
  uiux: {
    requiredSkills: [
      "figma",
      "sketch",
      "adobe xd",
      "user research",
      "wireframing",
      "prototyping",
      "usability testing",
    ],
    requiredMatchPercentage: 65,
    description: "UI/UX Developer",
  },
};

// Main endpoint
app.post("/analyze", upload.single("resume", 5), async (req, res) => {
  const filePath = req.file.path;

  try {
    // 1. Upload to Convex
    const convexUrl = await uploadToConvex(filePath);

    // 2. Send Convex URL to Flask for skill extraction
    const flaskResponse = await axios.post(
      "https://sanjay1123.pythonanywhere.com/extract_skills",
      { url: convexUrl }
    );

    const extractedSkills = flaskResponse.data.skills || [];

    // 3. Match profiles
    const matchingProfiles = [];

    for (const [role, profile] of Object.entries(profiles)) {
      const matched = profile.requiredSkills.filter((skill) =>
        extractedSkills.includes(skill.toLowerCase())
      );
      const percentage = (matched.length / profile.requiredSkills.length) * 100;

      if (percentage >= profile.requiredMatchPercentage) {
        matchingProfiles.push({
          role,
          description: profile.description,
          matchPercentage: percentage.toFixed(2),
        });
      }
    }

    res.json({
      extractedSkills,
      matchingProfiles,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to process resume." });
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
