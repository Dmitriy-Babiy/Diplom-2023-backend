import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:www@backend-data-base.6ogihfx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => console.log("DB error"));

app.use(express.json());

// Обработка запросов
app.get("/", (req, res) => {
  res.send("Hello 123!");
});

// Запуск сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK (http://localhost:4444/)");
});
