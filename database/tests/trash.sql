select * from media WHERE trashed == 1;

update media set trashed = 0;

delete from media where id == 1;
