import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicpulse';

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined — dotenv failed");
}

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Start Server
export const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
