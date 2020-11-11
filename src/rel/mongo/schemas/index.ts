/**
 * Export modules for Mongoose schemas
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {user_schema_definition} from './urn_user';

import {RelationName} from '../../../types';

type MongoSchemas = {
	[P in RelationName]: mongoose.Schema;
}

export const mongo_schemas:MongoSchemas = {
	urn_user: new mongoose.Schema(user_schema_definition)
};

