import db from "../database/db.js";
import habits from "../models/habit.model.js";
import habitEntries from "../models/habitEntry.model.js";
import { eq, and } from "drizzle-orm";

const allowedStatuses = ["active", "completed", "on hold", "archived"];

const createHabitService = async (habitData) => {
  const result = await db.insert(habits).values(habitData);
  const insertedId = result.lastInsertRowid;

  if (!insertedId) throw new Error("Habit creation failed");

  return getHabitByIdService(habitData.userId, insertedId);
};

const getHabitByIdService = async (userId, habitId) => {
  const habit = await db
    .select()
    .from(habits)
    .where(
      and(
        eq(habits.id, habitId),
        eq(habits.userId, userId),
        habits.status !== "archived"
      )
    );

  if (habit.length === 0) throw new Error("Habit not found");
  return habit[0];
};

const getHabitsByUserService = async (userId, status = "active") => {
  if (status && !allowedStatuses.includes(status)) {
    throw new Error("Invalid status filter");
  }

  return await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.status, status)));
};

const updateHabitService = async (habitData) => {
  const habitExists = await checkHabitExistForUserService(
    habitData.userId,
    habitData.id
  );
  if (!habitExists) throw new Error("Habit not found");

  if (habitData.status && !allowedStatuses.includes(habitData.status)) {
    throw new Error("Invalid status update");
  }

  const result = await db
    .update(habits)
    .set(habitData)
    .where(eq(habits.id, habitData.id));

  if (result.changes === 0) throw new Error("Habit update failed");
  return getHabitByIdService(habitData.userId, habitData.id);
};
//soft delete habit
// by setting status to "archived"
const deleteHabitService = async (userId, habitId) => {
  const habitExists = await checkHabitExistForUserService(userId, habitId);
  if (!habitExists) throw new Error("Habit not found");

  return await db
    .update(habits)
    .set({ status: "archived" })
    .where(eq(habits.id, habitId));
};

const checkHabitExistForUserService = async (userId, habitId) => {
  const habit = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

  return habit.length > 0;
};

//TODO: Seperate this function to a new service 
const insertHabitEntryService = async (entryData, userId) => {
  const habitExists = await checkHabitExistForUserService(
    userId,
    entryData.habitId
  );
  if (!habitExists) throw new Error("Habit not found");

  const result = await db.insert(habitEntries).values(entryData);

  if (!result.lastInsertRowid) throw new Error("Habit entry creation failed");

  const insertedEntry = await db
    .select()
    .from(habitEntries)
    .where(eq(habitEntries.id, result.lastInsertRowid));

    if (insertedEntry.length === 0) throw new Error("Habit entry not found");
    return insertedEntry[0];
};

export {
  createHabitService,
  getHabitByIdService,
  getHabitsByUserService,
  updateHabitService,
  deleteHabitService,
  insertHabitEntryService
};
