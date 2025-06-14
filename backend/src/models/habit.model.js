import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import users from "./user.model.js";
import habitCategories from "./habit.categories.js";

const habits = sqliteTable("habits", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text({ length: 50 }).notNull(),
  description: text({ length: 255 }),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => habitCategories.id, { onDelete: "cascade" }),
  endDate: text(),
  status: text({ enum: ["active", "completed", "archived", "on hold"] })
    .notNull()
    .$defaultFn(() => "active"),
  targetDays: integer("target_days")
    .notNull()
    .$defaultFn(() => 0),
});

export default habits;
