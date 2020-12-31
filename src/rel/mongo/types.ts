/**
 * Types for Mongo Module
 *
 * @packageDocumentation
 */

export type ConnectionName = 'main' | 'trash';

export type PopulateObject = {
	path: string,
	model: string,
	populate?: PopulateObject[]
}

