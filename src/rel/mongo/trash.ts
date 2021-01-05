/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../../types';

import {Relation} from '../types';

import {ConnectionName} from './types';

import {MongooseRelation} from './relation';

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
	
	protected _get_conn_name():ConnectionName{
		return 'trash';
	}
	
}

export function trash_create<A extends AtomName>(atom_name: A)
		:MongooseRelation<A>{
	urn_log.fn_debug(`Create MongooseTrashRelation`);
	return new MongooseTrashRelation<A>(atom_name);
}
