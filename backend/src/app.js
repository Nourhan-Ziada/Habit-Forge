import express from 'express';
import dotenv from 'dotenv';
import habitRoutes from './routes/habit.routes.js';
import morgan from 'morgan';
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", habitRoutes);

app.get("/", (req, res) => {
  res.send("Habit-Forge Backend API is running 🚀");
});

export default app;
