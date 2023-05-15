import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router/index.js';
import errorMiddleware from './middleware/error-middleware.js';
import multer from 'multer';


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })
);
app.use('/api', router);
app.use(errorMiddleware);
app.use(express.static('public'));

//Обработка фото
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage }).single('file');

app.post('/api/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.sendStatus(500);
      }
      res.send(req.file.filename);
    });
  });
//Конец обработки фото

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Server OK (http://localhost:${PORT}/)`));
    } catch (error) {
        console.log(error);
    }
};

start();
