import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import users from '../models/user.model.js';
import habits from '../models/habit.model.js';
import habitCategories from '../models/habit.categories.js';
import habitEntries from '../models/habitEntry.model.js';


const client = createClient({
  url: process.env.DB_FILE_NAME,
});
const db = drizzle(client, {
  schema: {
    users,
    habits,
    habitCategories,
    habitEntries,
  },
  logger: true,
});


export default db;