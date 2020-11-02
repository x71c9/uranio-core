/**
 * Type module for Data Access Layer
 *
 * @packageDocumentation
 */

/**
 * Type for Query Filter paramter
 */
export type QueryFilter<T> = {
	
	[P in keyof T]: any
	
}

/**
 * Interface for option object used for querying the database
 */
export interface QueryOptions<T> {
	/*
	 * Sort by field
	 */
	sort?: string|QueryFilter<T>;
	
	/*
	 * Limit records result
	 */
	limit?: number|null;

	/*
	 * Skip number of records
	 */
	skip?: number;
}

