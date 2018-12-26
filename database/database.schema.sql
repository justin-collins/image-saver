BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `mediaType` (
	`type`	TEXT PRIMARY KEY NOT NULL
);
INSERT OR IGNORE INTO mediaType(type) VALUES ('Image'), ('Gif'), ('Video');

CREATE TABLE IF NOT EXISTS `media` (
	`id`	INTEGER PRIMARY KEY,
	'title'	TEXT,
	`url`	TEXT NOT NULL,
	'type'	Text NOT NULL REFERENCES mediaType(type)
);

COMMIT;
