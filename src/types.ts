/**
 * Shared type module
 *
 * @packageDocumentation
 */

export type DBType = 'mongo'; // | 'mysql'

export type RelationName = 'urn_user'; // | 'urn_media';

type KeysOfType<T> = {
	
	[P in keyof T]?:any;
	
}

export type QueryOptions<T> = {
	
	sort?: string | KeysOfType<T>;
	
	limit?: number;
	
	skip?: number;
	
}

type FilterComparsionType = {
	
	$eq: string | number,
	
	$gt: string | number,
	
	$gte: string | number,
	
	$in: [string | number],
	
	$lt: string | number,
	
	$lte: string | number,
	
	$ne: string | number,
	
	$nin: [string | number]
}

export type ComparsionQueryFilter = {
	[P in keyof FilterComparsionType]?: any
}

type FilterAndOrNorType<M> = {
	
	$and?: KeysOfType<M>[],
	
	$or?: KeysOfType<M>[],
	
	$nor?: KeysOfType<M>[],
	
	$not?: KeysOfType<M>[]
	
};

// type ConditionalQueryFilter<M> = {
//   [P in keyof FilterAndOrNorType<M>]?: KeysOfType<M>[]
// }

// export type FilterType<T> = KeysOfType<T> | ConditionalQueryFilter<T>;
export type FilterType<T> = KeysOfType<T> & FilterAndOrNorType<T>;



export const _queryop = {
	andornor: {
		$and: null,
		$or: null,
		$nor: null,
		$not: null
	},
	comparsion: {
		$eq: null,
		$gt: null,
		$gte: null,
		$in: null,
		$lt: null,
		$lte: null,
		$ne: null,
		$nin: null
	}
};

