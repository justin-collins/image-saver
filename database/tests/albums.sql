select * from albums;

select albums.id, albums.title, albums.created_at, media.url, media.type from albums LEFT OUTER JOIN media ON albums.cover_media_id == media.id;

select media.id, media.title, media.type, media.url from mediaAlbumsMap INNER JOIN media ON media.id == mediaAlbumsMap.media_id WHERE mediaAlbumsMap.album_id == 1 AND media.trashed == 0;

insert into albums (title) values ('Tester');

insert into mediaAlbumsMap (media_id, album_id) values (1, 1);
