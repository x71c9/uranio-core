/**
 * Types for Mongo Module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

export type PopulateObject = {
	path: string,
	model: string,
	match?: mongoose._FilterQuery<any>,
	populate?: PopulateObject[]
}

