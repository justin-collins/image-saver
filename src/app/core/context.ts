import { ContextType } from './contextType';
import { Album } from './album';
import { Tag } from './tag';
import { MediaFilter } from './media.service';

export interface Context {
	dataObject: Album | Tag | MediaFilter;
	type: ContextType;
}
