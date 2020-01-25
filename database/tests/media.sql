select * from media ORDER BY created_at DESC;

select * from mediaType;

select * from media WHERE trashed == 1;

insert into media (title, url, type, location) values ('test', 'https://i.imgur.com/A8eQsll.jpg', 'IMAGE', 'REMOTE') ON CONFLICT(url) DO UPDATE SET id = id;

select distinct media.* from media LEFT JOIN mediaTagsMap ON media.id == mediaTagsMap.media_id LEFT JOIN tags ON mediaTagsMap.tag_id == tags.id WHERE media.trashed == 0 AND (tags.title LIKE "%top%" OR media.title LIKE "%2011%" OR media.url LIKE "%2011%");
