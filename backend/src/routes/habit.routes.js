import { Router } from 'express';
import {
  getHabit,
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  insertHabitEntry,
  getHabitsWithTodayEntry,
  getHabitStats
} from '../controllers/habit.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const router = Router();
//TODO: I need to change the routes when i apply JWT i should get userId from the token
// TODO: I need to add validation for the request body and params
router.get('/habits/today', authenticateToken, getHabitsWithTodayEntry);
router.get('/habits/:habitId/stats', authenticateToken, getHabitStats);

router.get('/habits/:habitId', authenticateToken, getHabit);
// with specific status
router.get('/habits', authenticateToken, getHabits);
router.post('/habits', authenticateToken, createHabit);
router.put('/habits/:habitId', authenticateToken, updateHabit);
router.delete('/habits/:habitId', authenticateToken, deleteHabit);
router.post('/habits/entries', authenticateToken, insertHabitEntry);

export default router;
