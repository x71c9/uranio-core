/**
 * Shared type module
 *
 * @packageDocumentation
 */

import {AtomName, Grain} from './typ/atom_config';

export * from './typ/atom_config';

export type DatabaseType = 'mongo'; // | 'mysql'

// export type RelationName = 'urn_user'; // | 'urn_media';

export type Configuration = {
	
	db_type: DatabaseType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
}

type KeysOfType<A extends AtomName> = {
	
	[P in keyof Grain<A>]?: any;
	
}

export type QueryOptions<A extends AtomName> = {
	
	sort?: string | KeysOfType<A>;
	
	limit?: number;
	
	skip?: number;
	
}

type FilterLogicType<A extends AtomName> = {
	
	$and?: KeysOfType<A>[],
	
	$or?: KeysOfType<A>[],
	
	$nor?: KeysOfType<A>[],
	
	$not?: KeysOfType<A>[]
	
};

export type FilterType<A extends AtomName> = KeysOfType<A> & FilterLogicType<A>;



