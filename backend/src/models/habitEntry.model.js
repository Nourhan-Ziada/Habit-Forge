import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import habits  from "./habit.model.js";
const habitEntries = sqliteTable("habit_entries", {
  id: integer().primaryKey({ autoIncrement: true }),
  date: text().$defaultFn(() => new Date().toISOString()),
  completed: integer("completed")
    .notNull()
    .$defaultFn(() => 0),
    habitId: integer("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
});
export default habitEntries;
