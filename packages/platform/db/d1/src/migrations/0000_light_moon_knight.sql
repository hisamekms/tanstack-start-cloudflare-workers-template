CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`version` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
