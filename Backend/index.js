import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8000;
const app = express();

import cors from 'cors';
import connectDB from './config/db.js';



import authRoutes from './routers/authRouters.js';



dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(cors());
app.use(cookieParser());

app.use('/api', authRoutes);




connectDB();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});