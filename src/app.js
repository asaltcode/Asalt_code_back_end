import express from "express";
import cors from "cors";
import AppRoutes from "./routes/index.js";
import cookieParser from 'cookie-parser'
import errorHandl from "./middleware/error.js";
import path, { dirname } from "path"
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));
app.use("/api", AppRoutes)

app.use(errorHandl)

export default app