import { ContextType } from './contextType';
import { Album } from './album';

export interface Context {
	dataObject: Album;
	type: ContextType;
}
