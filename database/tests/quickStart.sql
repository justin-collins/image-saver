insert into media (title, url, type) values ('test', 'https://i.imgur.com/A8eQsll.jpg', 'IMAGE');
insert into media (title, url, type) values ('test', 'https://i.imgur.com/HNWMaIv.mp4', 'VIDEO');
insert into media (title, url, type, trashed, trashed_at) values ('test', 'https://i.imgur.com/fSgnUKW.jpg', 'IMAGE', 1, CURRENT_TIMESTAMP);
insert into albums (title) values ('Tester');
insert into mediaAlbumsMap (media_id, album_id) values (1, 1);
