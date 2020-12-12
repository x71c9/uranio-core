/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_util} from 'urn-lib';

// import * as urn_atm from '../../atm/';

import {AtomName} from '../../types';

import {Relation} from '../types';

// import {mongo_trash_schemas} from './schemas/';

import * as mongo_connection from './connection';

import {MongooseRelation} from './relation';

import {core_config} from '../../defaults';

const mongo_trash_conn = mongo_connection.create(
	'trash',
	core_config.db_host,
	core_config.db_port,
	core_config.db_trash_name
);

/**
 * Mongoose Trash Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class MongooseTrashRelation<A extends AtomName> extends MongooseRelation<A>
	implements Relation<A> {
	
	constructor(relation_name:A, _mongo_schema:mongoose.SchemaDefinition){
		super(relation_name, _mongo_schema);
	}
	
	protected _get_connection():mongo_connection.ConnectionInstance{
		return mongo_trash_conn;
	}
	
	protected _complie_mongoose_model():mongoose.Model<mongoose.Document>{
		const mongo_trash_schema = new mongoose.Schema(_allow_duplicate(this._mongo_schema));
		return this._conn.get_model(this.relation_name, mongo_trash_schema);
	}
	
}

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

// export type MongooseTrashRelationInstance = InstanceType<typeof MongooseTrashRelation>;

// export function create(relation_name:RelationName):MongooseTrashRelationInstance{
//   urn_log.fn_debug(`Create Mongoose Trash Relation`);
//   return new MongooseTrashRelation(relation_name);
// }
