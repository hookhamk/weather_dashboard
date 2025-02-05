import express from 'express';
const app = express();

// Serve a default favicon
// @ts-ignore
app.use("/favicon.ico", (_req, res) => res.status(204).end());

// Serve static files
app.use(express.static("public")); // Make sure favicon.ico is inside 'public/'

app.listen(3000, () => console.log("Server running on port 3000"));
