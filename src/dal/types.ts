/**
 * Type module for Data Access Layer
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
	/*
	 * Sort by field
	 */
	sort?: string | QueryFilter<T>;
	
	/*
	 * Limit records result
	 */
	limit?: number;

	/*
	 * Skip number of records
	 */
	skip?: number;
}


type FilterAndOrNorType = {
	
	$and: any[],
	
	$or: any[],
	
	$now: any[],
	
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



