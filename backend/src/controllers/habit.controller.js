import {
  getHabitsByUserService,
  getHabitByIdService,
  createHabitService,
  updateHabitService,
  deleteHabitService,
  insertHabitEntryService
} from "../services/habit.service.js";

const getHabit = async (req, res) => {
  const { userId, habitId } = req.params;
  try {
    const habit = await getHabitByIdService(userId, habitId);
    res.status(200).json(habit);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const getHabits = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  try {
    const habits = await getHabitsByUserService(userId, status);
    res.status(200).json(habits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const createHabit = async (req, res) => {
  const habitData = req.body;
  try {
    const newHabit = await createHabitService(habitData);
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateHabit = async (req, res) => {
  const habitData = req.body;
  try {
    const updatedHabit = await updateHabitService(habitData);
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteHabit = async (req, res) => {
  const { userId, habitId } = req.params;
  try {
    await deleteHabitService(userId, habitId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const insertHabitEntry = async (req, res) => {
  const entryData = req.body;
  // make it currently form params
  const { userId } = req.params;
  try {
    const entryId = await insertHabitEntryService(entryData, userId);
    res.status(201).json({ entryId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getHabit, getHabits, createHabit, updateHabit, deleteHabit, insertHabitEntry };
