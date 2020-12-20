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

// import {generate_mongoose_trash_schema} from './schema';

import * as mongo_connection from './connection';

import {MongooseRelation} from './relation';

import {core_config} from '../../config/defaults';

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
	
	constructor(atom_name:A){
		super(atom_name);
	}
	
	protected _get_connection():mongo_connection.ConnectionInstance{
		return mongo_trash_conn;
	}
	
	protected _complie_mongoose_model():mongoose.Model<mongoose.Document>{
		const mongo_trash_schema = new mongoose.Schema(
			_allow_duplicate(this._mongo_schema_def), { versionKey: false }
		);
		return this._conn.get_model(this.atom_name, mongo_trash_schema);
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

// export function create(atom_name:RelationName):MongooseTrashRelationInstance{
//   urn_log.fn_debug(`Create Mongoose Trash Relation`);
//   return new MongooseTrashRelation(atom_name);
// }

export function trash_create<A extends AtomName>(atom_name: A)
		:MongooseRelation<A>{
	urn_log.fn_debug(`Create MongooseTrashRelation`);
	return new MongooseTrashRelation<A>(atom_name);
}
