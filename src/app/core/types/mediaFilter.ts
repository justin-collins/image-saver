import { MediaLocation } from './mediaLocation';
import { MediaSortBy } from './mediaSortBy';
import { MediaType } from './mediaType';
import { Tag } from './tag';

export interface MediaFilter {
	term?: string;
	type?: MediaType;
	tags?: Tag[];
	location?: MediaLocation;
	sortBy?: MediaSortBy;
}
