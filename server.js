const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Logging middleware
app.use((req, res, next) => {
    console.log(`📢 ${req.method} request to ${req.url}`);
    next();
});

// Function to read JSON files safely
const readJsonFile = (fileName) => {
    try {
        const filePath = path.join(__dirname, "data", fileName);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Error: ${fileName} not found`);
            return [];
        }
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading ${fileName}:`, error.message);
        return [];
    }
};

// Generic function to get all items
const getAllItems = (req, res, fileName) => {
    try {
        const items = readJsonFile(fileName);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Generic function to get a single item by ID
const getItemById = (req, res, fileName) => {
    try {
        const items = readJsonFile(fileName);
        const item = items.find((i) => i.id === parseInt(req.params.id));

        if (!item) {
            return res.status(404).json({ error: `${fileName.replace(".json", "")} not found` });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Root API endpoint
app.get("/", (req, res) => {
    res.send("🎬 Welcome to JioCinema Backend API");
});

// API Endpoints
app.get("/movies", (req, res) => getAllItems(req, res, "movies.json"));
app.get("/movies/:id", (req, res) => getItemById(req, res, "movies.json"));

app.get("/anime", (req, res) => getAllItems(req, res, "anime.json"));
app.get("/anime/:id", (req, res) => getItemById(req, res, "anime.json"));

app.get("/series", (req, res) => getAllItems(req, res, "series.json"));
app.get("/series/:id", (req, res) => getItemById(req, res, "series.json"));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
