import db from './db.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

import users from '../models/user.model.js';
import habits from '../models/habit.model.js';
import habitCategories from '../models/habit.categories.js';

async function seed() {
  console.log('Seeding start...');

  // 1. Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, 'alice@example.com'),
  });

  // 2. Generate hashed password only if user does not exist
  let user;
  if (existingUser) {
    user = existingUser;
  } else {
    const passwordHash = await bcrypt.hash('test123', 10);

    // 3. Insert new user with password hash (use correct property name passwordHash)
    const insertedUsers = await db.insert(users).values({
      email: 'alice@example.com',
      passwordHash: passwordHash,
    }).returning();

    user = insertedUsers[0];
  }

  console.log(`User created or found: ${user.email}`);

  // 4. Insert categories
  const categoryNames = ['Health', 'Mindfulness', 'Productivity'];
  const existingCategories = await db.select().from(habitCategories);

  const categoriesToInsert = categoryNames
    .filter((name) => !existingCategories.find((cat) => cat.name === name))
    .map((name) => ({ name }));

  if (categoriesToInsert.length > 0) {
    await db.insert(habitCategories).values(categoriesToInsert);
  }

  const categories = await db.select().from(habitCategories);
  console.log(`Categories in DB: ${categories.map((c) => c.name).join(', ')}`);

  // 5. Insert habits
  const health = categories.find((c) => c.name === 'Health');
  const productivity = categories.find((c) => c.name === 'Productivity');

  if (!health || !productivity) {
    throw new Error('Missing required categories');
  }

  const habitData = [
    {
      name: 'Drink Water',
      description: 'Drink 8 glasses daily',
      userId: user.id,
      categoryId: health.id,
    },
    {
      name: 'Morning Walk',
      description: 'Take a 20-minute walk every morning',
      userId: user.id,
      categoryId: health.id,
    },
    {
      name: 'Plan the Day',
      description: 'Write daily tasks each morning',
      userId: user.id,
      categoryId: productivity.id,
    },
  ];

  await db.insert(habits).values(habitData);

  console.log(`Seeded ${habitData.length} habits for user ${user.email}`);
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
});
