PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(50) NOT NULL,
	`description` text(255),
	`createdAt` text,
	`user_id` integer NOT NULL,
	`category_id` integer,
	`endDate` text,
	`status` text NOT NULL,
	`target_days` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `habit_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_habits`("id", "name", "description", "createdAt", "user_id", "category_id", "endDate", "status", "target_days") SELECT "id", "name", "description", "createdAt", "user_id", "category_id", "endDate", "status", "target_days" FROM `habits`;--> statement-breakpoint
DROP TABLE `habits`;--> statement-breakpoint
ALTER TABLE `__new_habits` RENAME TO `habits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;