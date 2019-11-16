select * from albums;

select albums.id, albums.title, albums.created_at, media.id media_id, media.url media_url, media.type media_type from albums LEFT OUTER JOIN albumCovers on albums.id == albumCovers.album_id LEFT OUTER JOIN media ON albumCovers.media_id == media.id ORDER BY albums.created_at DESC;

select media.id, media.title, media.type, media.url from mediaAlbumsMap INNER JOIN media ON media.id == mediaAlbumsMap.media_id WHERE mediaAlbumsMap.album_id == 1 AND media.trashed == 0;

insert into albums (title) values ('Tester');

insert into albumCovers (album_id, media_id) values (1, 1);

insert into mediaAlbumsMap (media_id, album_id) values (1, 1);
