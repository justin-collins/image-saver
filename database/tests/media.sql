select * from media ORDER BY created_at DESC;

select * from mediaType;

select * from media WHERE trashed == 1;

insert into media (title, url, type) values ('test', 'https://i.imgur.com/A8eQsll.jpg', 'IMAGE');

select distinct media.* from media LEFT JOIN mediaTagsMap LEFT JOIN tags WHERE media.trashed == 0 AND (tags.title LIKE "%top%" AND mediaTagsMap.tag_id == tags.id AND media.id == mediaTagsMap.media_id) OR media.title LIKE "%2011%" OR media.url LIKE "%2011%"
