ALTER TABLE `habits` ADD `endDate` text;--> statement-breakpoint
ALTER TABLE `habits` ADD `status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `target_days` integer NOT NULL;