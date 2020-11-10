/**
 * Shared type module
 *
 * @packageDocumentation
 */

/**
 * Type for Query Filter paramter
 */
export type QueryFilter<T> = {
	
	[P in keyof T]?: any
	
}

/**
 * Interface for option object used for querying the database
 */
export interface QueryOptions<T> {
	
	sort?: string | QueryFilter<T>;
	
	limit?: number;
	
	skip?: number;
	
}


type FilterAndOrNorType = {
	
	$and: any[],
	
	$or: any[],
	
	$nor: any[],
	
	$not: any[]
	
};

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

type ConditionalQueryFilter = {
	[P in keyof FilterAndOrNorType]: any[]
}

export type ComparsionQueryFilter = {
	[P in keyof FilterComparsionType]: any
}

export type FilterType<T> = QueryFilter<T> | ConditionalQueryFilter;



