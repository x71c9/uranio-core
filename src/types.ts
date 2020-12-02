/**
 * Shared type module
 *
 * @packageDocumentation
 */

export {AtomConfig, AtomFieldType} from './typ/atom_config';

export type DBType = 'mongo'; // | 'mysql'

export type RelationName = 'urn_user'; // | 'urn_media';

export type Configuration = {
	
	db_type: DBType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
}

type KeysOfType<T> = {
	
	[P in keyof T]?: any;
	
}

export type QueryOptions<T> = {
	
	sort?: string | KeysOfType<T>;
	
	limit?: number;
	
	skip?: number;
	
}

type FilterLogicType<M> = {
	
	$and?: KeysOfType<M>[],
	
	$or?: KeysOfType<M>[],
	
	$nor?: KeysOfType<M>[],
	
	$not?: KeysOfType<M>[]
	
};

export type FilterType<T> = KeysOfType<T> & FilterLogicType<T>;

