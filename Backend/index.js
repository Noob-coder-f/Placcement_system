import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8000;
const app = express();

import cors from 'cors';
import connectDB from './config/db.js';



import authRoutes from './routers/authRouters.js';
import internRoutes from './routers/InternRoutes.js';
// import MentorRoutes from './model/RegisterDB/mentorSchema.js';
import MentorRoutes from './routers/MentorRoutes.js';

import paymentRoutes from './routers/PaymentRoutes.js';



dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(cors());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', internRoutes);
app.use('/api', MentorRoutes);

app.use("/api", paymentRoutes);



connectDB();

//Routes
app.use('/api', internRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});