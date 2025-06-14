import express from 'express';
import dotenv from 'dotenv';
import habitRoutes from './routes/habit.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", habitRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Habit-Forge Backend API is running 🚀");
});

export default app;
