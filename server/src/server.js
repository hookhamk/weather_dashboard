import dotenv from 'dotenv';
import express from 'express';
import router from './routes/api/index.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Implements middleware to access client dist folder, parsing JSON, form data and connect routes
app.use(express.static('public'));
app.use(express.json());
app.use(router);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
