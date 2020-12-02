/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log} from 'urn-lib';

import * as urn_atm from '../../atm/';

import {RelationName} from '../../types';

import {Relation} from '../types';

import {mongo_trash_schemas} from './schemas/';

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
export class MongooseTrashRelation<M extends urn_atm.models.Resource> extends MongooseRelation<M>
	implements Relation<M> {
	
	constructor(public relation_name:RelationName){
		super(relation_name);
	}
	
	protected _get_connection():mongo_connection.ConnectionInstance{
		return mongo_trash_conn;
	}
	
	protected _complie_mongoose_model():mongoose.Model<mongoose.Document>{
		return this._conn.get_model(this.relation_name, mongo_trash_schemas[this.relation_name]);
	}
	
}

// export type MongooseTrashRelationInstance = InstanceType<typeof MongooseTrashRelation>;

// export function create(relation_name:RelationName):MongooseTrashRelationInstance{
//   urn_log.fn_debug(`Create Mongoose Trash Relation`);
//   return new MongooseTrashRelation(relation_name);
// }
