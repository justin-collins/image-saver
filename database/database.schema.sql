BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `mediaType` (
	`type`	TEXT PRIMARY KEY NOT NULL
);
INSERT OR IGNORE INTO mediaType(type) VALUES ('IMAGE'), ('GIF'), ('VIDEO'), ('AUDIO'), ('EMBED');

CREATE TABLE IF NOT EXISTS `mediaLocation` (
	`location`	TEXT PRIMARY KEY NOT NULL
);
INSERT OR IGNORE INTO mediaLocation(location) VALUES ('REMOTE'), ('LOCAL');

CREATE TABLE IF NOT EXISTS `media` (
	`id` INTEGER PRIMARY KEY,
	`title` TEXT,
	`url` TEXT NOT NULL UNIQUE,
	`source` TEXT,
	`type` Text NOT NULL REFERENCES mediaType(`type`),
	`location` TEXT NOT NULL REFERENCES mediaLocation(`location`),
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
	FOREIGN KEY(`media_id`) REFERENCES media(`id`) ON DELETE CASCADE,
	FOREIGN KEY(`tag_id`) REFERENCES tags(`id`) ON DELETE CASCADE,
	UNIQUE(tag_id, media_id)
);

CREATE TABLE IF NOT EXISTS `albums` (
	`id` INTEGER PRIMARY KEY,
	`title` TEXT NOT NULL,
	`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `albumCovers` (
	`id` INTEGER PRIMARY KEY,
	`media_id` INTEGER,
	`album_id` INTEGER UNIQUE,
	FOREIGN KEY(`media_id`) REFERENCES media(`id`) ON DELETE CASCADE,
	FOREIGN KEY(`album_id`) REFERENCES albums(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `mediaAlbumsMap` (
	`id` INTEGER PRIMARY KEY,
	`media_id` INTEGER,
	`album_id` INTEGER,
	`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(`media_id`) REFERENCES media(`id`) ON DELETE CASCADE,
	FOREIGN KEY(`album_id`) REFERENCES albums(`id`) ON DELETE CASCADE,
	UNIQUE(media_id, album_id)
);

CREATE TABLE IF NOT EXISTS `albumsTagsMap` (
	`id` INTEGER PRIMARY KEY,
	`tag_id` INTEGER,
	`album_id` INTEGER,
	FOREIGN KEY(`tag_id`) REFERENCES tags(`id`) ON DELETE CASCADE,
	FOREIGN KEY(`album_id`) REFERENCES albums(`id`) ON DELETE CASCADE,
	UNIQUE(tag_id, album_id)
);

COMMIT;
