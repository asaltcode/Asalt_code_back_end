import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AppRoutes from "./routes/index.js";
import cookieParser from 'cookie-parser'
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(AppRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});


app.listen(PORT, () =>
  console.log(`Server listeing at ${PORT}`)
);