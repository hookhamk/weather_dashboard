import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

const app = express();

// GET route for the home page
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
  });

export default router;
