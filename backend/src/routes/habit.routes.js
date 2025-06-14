import { Router } from 'express';
import {
  getHabit,
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  insertHabitEntry
} from '../controllers/habit.controller.js';

const router = Router();
//TODO: I need to change the routes when i apply JWT i should get userId from the token
// TODO: I need to add validation for the request body and params

router.get('/:userId/habits/:habitId', getHabit);
// with specific status
router.get('/:userId/habits', getHabits);
router.post('/:userId/habits', createHabit);
router.put('/:userId/habits/:habitId', updateHabit);
router.delete('/:userId/habits/:habitId', deleteHabit);
router.post('/:userId/habits/entries', insertHabitEntry);

export default router;
