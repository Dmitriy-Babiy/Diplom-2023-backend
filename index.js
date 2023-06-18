import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error-middleware.js';
import router from './router/index.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })
);
app.use('/api', router);
app.use(express.static('public'));
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Server OK (http://localhost:${PORT}/)`));
    } catch (error) {
        console.log(error);
    }
};

start();
