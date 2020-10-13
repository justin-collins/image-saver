import { MediaLocation } from './mediaLocation';
import { MediaSortBy } from './mediaSortBy';
import { MediaType } from './mediaType';

export interface MediaFilter {
	term?: string;
	type?: MediaType;
	location?: MediaLocation;
	sortBy?: MediaSortBy;
}
