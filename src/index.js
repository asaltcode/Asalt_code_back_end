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
app.use(cookieParser());

app.post('/ref', (req, res)=>{
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  try {
    const decoded = jwt.verify(refreshToken, 'ldjfuLKjhusdWEfiyhxcvkLKyh');
    const accessToken = jwt.sign({ user: decoded.user }, 'ldjfuLKjhusdWEfiyhxcvkLKyh', { expiresIn: '1h' });
    res
      .header('Authorization', accessToken)
      .send(decoded.user);
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.use(AppRoutes)

app.listen(PORT, () =>
  console.log(`Server listeing at http://localhost:${PORT}`)
);