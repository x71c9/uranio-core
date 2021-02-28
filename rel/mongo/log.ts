/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName, ConnectionName} from '../../typ/';

import {Relation} from '../types';

// import {ConnectionName} from './types';

import {MongooseRelation} from './relation';

/**
 * Mongoose Trash Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class MongooseLogRelation<A extends AtomName> extends MongooseRelation<A>
	implements Relation<A> {
	
	constructor(atom_name:A){
		super(atom_name);
	}
	
	protected _get_conn_name():ConnectionName{
		return 'log';
	}
	
}

export function log_create<A extends AtomName>(atom_name: A)
		:MongooseRelation<A>{
	urn_log.fn_debug(`Create MongooseLogRelation`);
	return new MongooseLogRelation<A>(atom_name);
}
