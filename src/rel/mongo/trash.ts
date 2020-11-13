/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_atm from '../../atm/';

import {RelationName} from '../../types';

import {Relation} from '../types';

import * as mongo_connection from './connection';

import {MongooseRelation} from './relation';

const mongo_trash_conn = mongo_connection.create(
	'trash',
	process.env.urn_db_host!,
	parseInt(process.env.urn_db_port!),
	process.env.urn_trash_db_name!
);

/**
 * Mongoose Trash Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class MongooseTrashRelation<M extends urn_atm.models.Resource> extends MongooseRelation<M>
	implements Relation<M> {
	
	constructor(public relation_name:RelationName){
		super(relation_name, mongo_trash_conn);
	}
	
}

// export type MongooseTrashRelationInstance = InstanceType<typeof MongooseTrashRelation>;

// export function create(relation_name:RelationName):MongooseTrashRelationInstance{
//   urn_log.fn_debug(`Create Mongoose Trash Relation`);
//   return new MongooseTrashRelation(relation_name);
// }
