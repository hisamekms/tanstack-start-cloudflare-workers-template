CREATE TABLE `users_app` (
	`id` text PRIMARY KEY NOT NULL,
	`sub` text NOT NULL,
	`email` text NOT NULL,
	`version` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_app_sub_unique` ON `users_app` (`sub`);
