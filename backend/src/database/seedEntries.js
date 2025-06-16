import habitEntries from '../models/habitEntry.model.js'; 
import { subDays, format } from 'date-fns';
import db from './db.js';
import users from '../models/user.model.js';
import habits from '../models/habit.model.js';
import habitCategories from '../models/habit.categories.js';

// 6. Seed entries for each habit for the last 30 days
const allHabits = await db.select().from(habits);

const today = new Date();
const daysToSeed = 30;

const entriesToInsert = [];

for (const habit of allHabits) {
  for (let i = 0; i < daysToSeed; i++) {
    const entryDate = subDays(today, i);
    entriesToInsert.push({
      habitId: habit.id,
      date: format(entryDate, 'yyyy-MM-dd'),
      completed: Math.random() > 0.2 ? 1 : 0, // 80% chance completed
    });
  }
}

// Insert in chunks if too many
const chunkSize = 500;
for (let i = 0; i < entriesToInsert.length; i += chunkSize) {
  const chunk = entriesToInsert.slice(i, i + chunkSize);
  await db.insert(habitEntries).values(chunk);
}

console.log(`Seeded ${entriesToInsert.length} habit entries for the last ${daysToSeed} days.`);
