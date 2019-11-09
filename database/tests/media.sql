select * from media ORDER BY created_at DESC;

select * from mediaType;

select * from media WHERE trashed == 1;

insert into media (title, url, type) values ('test', 'https://i.imgur.com/A8eQsll.jpg', 'IMAGE');
