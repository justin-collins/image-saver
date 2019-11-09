BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `mediaType` (
	`type`	TEXT PRIMARY KEY NOT NULL
);
INSERT OR IGNORE INTO mediaType(type) VALUES ('IMAGE'), ('GIF'), ('VIDEO'), ('AUDIO'), ('EMBED');

CREATE TABLE IF NOT EXISTS `media` (
	`id` INTEGER PRIMARY KEY,
	`title` TEXT,
	`url` TEXT NOT NULL UNIQUE,
	`type` Text NOT NULL REFERENCES mediaType(`type`),
	`trashed` INTEGER DEFAULT 0,
	`trashed_at` DATETIME,
	`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `tagType` (
	`type` TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS `tags` (
	`id` INTEGER PRIMARY KEY,
	`title` TEXT NOT NULL,
	`type` TEXT NOT NULL REFERENCES tagType(`type`)
);

CREATE TABLE IF NOT EXISTS `mediaTagsMap` (
	`id` INTEGER PRIMARY KEY,
	`media_id` INTEGER,
	`tag_id` INTEGER,
	FOREIGN KEY(`media_id`) REFERENCES media(`id`),
	FOREIGN KEY(`tag_id`) REFERENCES tags(`id`)
);

CREATE TABLE IF NOT EXISTS `albums` (
	`id` INTEGER PRIMARY KEY,
	`title` TEXT NOT NULL,
	`cover_media_id` INTEGER,
	`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(`cover_media_id`) REFERENCES media(`id`)
);

CREATE TABLE IF NOT EXISTS `mediaAlbumsMap` (
	`id` INTEGER PRIMARY KEY,
	`media_id` INTEGER,
	`album_id` INTEGER,
	FOREIGN KEY(`media_id`) REFERENCES media(`id`),
	FOREIGN KEY(`album_id`) REFERENCES albums(`id`)
);

CREATE TABLE IF NOT EXISTS `albumsTagsMap` (
	`id` INTEGER PRIMARY KEY,
	`tags_id` INTEGER,
	`album_id` INTEGER,
	FOREIGN KEY(`tags_id`) REFERENCES tags(`id`),
	FOREIGN KEY(`album_id`) REFERENCES albums(`id`)
);

COMMIT;
