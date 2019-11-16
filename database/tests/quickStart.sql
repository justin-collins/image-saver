insert into media (title, url, source, type, location) values ('Guide dog puppy in training wearing his specially made puppy harness to prepare him for his big boy harness', 'https://i.imgur.com/A8eQsll.jpg', 'https://imgur.com/A8eQsll', 'IMAGE', 'REMOTE');
insert into media (title, url, source, type, location) values ('The definition of puppy eyes', 'https://i.imgur.com/HNWMaIv.mp4', 'https://imgur.com/HNWMaIv', 'VIDEO', 'REMOTE');
insert into media (title, url, source, type, location, trashed, trashed_at) values ('I''m puppy sitting this weekend and she the most beautiful golden. Don''t mind my dog in the background', 'https://i.imgur.com/fSgnUKW.jpg', 'https://imgur.com/fSgnUKW', 'IMAGE', 'REMOTE', 1, CURRENT_TIMESTAMP);
insert into albums (title, cover_media_id) values ('Tester', 1);
insert into mediaAlbumsMap (media_id, album_id) values (1, 1);
