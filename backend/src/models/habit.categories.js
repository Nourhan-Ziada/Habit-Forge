import { sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

const habitCategories = sqliteTable("habit_categories", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text({ length: 50 }).notNull(),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
});

export default habitCategories;
