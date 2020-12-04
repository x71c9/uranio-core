/**
 * Export modules for Mongoose schemas
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_util} from 'urn-lib';

import {user_schema_definition} from './urn_user';

// import {RelationName} from '../../../types';

type MongoSchemas = {
	[k:string]: mongoose.Schema;
}

export const mongo_schemas:MongoSchemas = {
	urn_user: new mongoose.Schema(user_schema_definition)
};

export const mongo_trash_schemas:MongoSchemas = {
	urn_user: new mongoose.Schema(_allow_duplicate(user_schema_definition))
};

function _allow_duplicate(schema_definition:mongoose.SchemaDefinition)
		:mongoose.SchemaDefinition{
	const schema_without_unique:mongoose.SchemaDefinition = {...schema_definition};
	for(const [k] of Object.entries(schema_without_unique)){
		if(urn_util.object.has_key(schema_without_unique[k], 'unique')){
			delete (schema_without_unique[k] as any).unique;
		}
	}
	return schema_without_unique;
}
