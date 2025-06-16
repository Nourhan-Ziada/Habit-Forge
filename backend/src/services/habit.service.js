import db from "../database/db.js";
import habits from "../models/habit.model.js";
import habitEntries from "../models/habitEntry.model.js";
import { eq, and, count } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { differenceInCalendarDays } from "date-fns";

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

const getHabitsByUserService = async (userId) => {
  return await db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId));
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
const insertHabitEntryService = async (entryData) => {
  const { userId, habitId, completed } = entryData;

  // Ensure the habit exists for this user
  const habitExists = await checkHabitExistForUserService(userId, habitId);
  if (!habitExists) throw new Error("Habit not found");

  const entryDay = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Check if a habit entry already exists for today
  const existingEntry = await db
    .select()
    .from(habitEntries)
    .where(
      and(
        eq(habitEntries.habitId, habitId),
        sql`DATE(${habitEntries.date}) = ${entryDay}`
      )
    );

  if (existingEntry.length > 0) {
    // Update existing entry
    await db
      .update(habitEntries)
      .set({ completed })
      .where(
        and(
          eq(habitEntries.habitId, habitId),
          sql`DATE(${habitEntries.date}) = ${entryDay}`
        )
      );

    const [updatedEntry] = await db
      .select()
      .from(habitEntries)
      .where(
        and(
          eq(habitEntries.habitId, habitId),
          sql`DATE(${habitEntries.date}) = ${entryDay}`
        )
      );

    if (!updatedEntry) throw new Error("Habit entry not found after update");
    return updatedEntry;

  } else {
    // Insert new entry
    const result = await db.insert(habitEntries).values({
      ...entryData,
      date: entryDay,
    });

    if (!result.lastInsertRowid) throw new Error("Habit entry creation failed");

    const [insertedEntry] = await db
      .select()
      .from(habitEntries)
      .where(eq(habitEntries.id, result.lastInsertRowid));

    if (!insertedEntry) throw new Error("Habit entry not found after insert");

    return insertedEntry;
  }
};

const getHabitsWithTodayEntryService = async (userId) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const habitsWithEntries = await db
    .select({
      id: habits.id,
      name: habits.name,
      completed: sql`CASE WHEN ${habitEntries.completed} IS NOT NULL THEN ${habitEntries.completed} ELSE 0 END`.as("completed"),
    })
    .from(habits)
    .leftJoin(
      habitEntries,
      and(
        eq(habits.id, habitEntries.habitId),
        sql`DATE(${habitEntries.date}) = ${today}`
      )
    )
    .where(
      and(
        eq(habits.userId, userId),
        eq(habits.status, "active")
      )
    );

  return habitsWithEntries;
};
const getHabitStatsService = async (userId, habitId, from, to) => {
  const validHabit = await checkHabitExistForUserService(userId, habitId);
  if (!validHabit) throw new Error("Habit not found");
  const endDate = new Date(to);
  const startDate = new Date(from);
  const dailyCompletion = await getDailyCompletion(
    habitId,
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0]
  );
  const completionPercentage =  await getCompletionPercentage(
    habitId,
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0]
  );
  const pieChartData = await getPieChartData(
    habitId,
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0]
  );
  return {
    habitId,
    dailyCompletion,
    completionPercentage,
    pieChartData,
  };
}
const getDailyCompletion = async (habitId, startDate, endDate) => {
  const result = await db
    .select({
      date: sql`DATE(${habitEntries.date})`.as("date"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(habitEntries)
    .where(
      and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.completed, true),
        sql`DATE(${habitEntries.date}) BETWEEN ${startDate} AND ${endDate}`
      )
    ).groupBy(sql`DATE(${habitEntries.date})`)
    .orderBy(sql`DATE(${habitEntries.date})`);

    const dataRange = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
     const formattedDate = currentDate.toISOString().split("T")[0]; 
     const entry = result.find(r => r.date === formattedDate);
     dataRange.push({
       date: formattedDate,
       count: entry ? entry.count : 0
     });
     currentDate.setDate(currentDate.getDate() + 1);
  }

  return dataRange;
}
const getCompletionPercentage = async (habitId, startDate, endDate) => {
  const totalDays = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;

  const completedDays = await db
    .select({
      completedCount: sql`COUNT(*)`.as("completedCount"),
    })
    .from(habitEntries)
    .where(
      and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.completed, true),
        sql`DATE(${habitEntries.date}) BETWEEN ${startDate} AND ${endDate}`
      )
    );

  return Math.round(
    (completedDays[0]?.completedCount || 0) / totalDays * 100
  );
};
const getPieChartData = async (habitId, startDate, endDate) => {
  const totalDays = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
  const completedDays = await db
    .select({
      completedCount: sql`COUNT(*)`.as("completedCount"),
    })
    .from(habitEntries)
    .where(
      and(
        eq(habitEntries.habitId, habitId),
        eq(habitEntries.completed, true),
        sql`DATE(${habitEntries.date}) BETWEEN ${startDate} AND ${endDate}`
      )
    );

  return {
    completed: completedDays[0]?.completedCount || 0,
    notCompleted: totalDays - (completedDays[0]?.completedCount || 0),
  };
};
 export {
  createHabitService,
  getHabitByIdService,
  getHabitsByUserService,
  updateHabitService,
  deleteHabitService,
  insertHabitEntryService,
  getHabitsWithTodayEntryService,
  getHabitStatsService
};
