select * from tags;

select * from mediaTagsMap;

select tags.id, tags.title, tags.created_at, COUNT(mediaTagsMap.media_id) as total from tags left join mediaTagsMap on mediaTagsMap.tag_id == tags.id GROUP BY tags.id ORDER BY tags.title ASC;

select tags.id, tags.title, tags.created_at from mediaTagsMap left join tags on tags.id == mediaTagsMap.tag_id WHERE mediaTagsMap.media_id == 1 ORDER BY tags.title ASC;

insert into mediaTagsMap (media_id, tag_id) values(1, 3);
