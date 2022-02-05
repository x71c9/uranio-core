/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

// import schema from 'uranio-schema';

import {schema} from '../../sch/';

import {ConnectionName} from '../../typ/book_cln';

import {Relation} from '../types';

// import {ConnectionName} from './types';

import {MongooseRelation} from './relation';

/**
 * Mongoose Trash Relation class
 */
@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class MongooseTrashRelation<A extends schema.AtomName> extends MongooseRelation<A>
	implements Relation<A> {
	
	constructor(atom_name:A){
		super(atom_name);
	}
	
	protected _get_conn_name():ConnectionName{
		return 'trash';
	}
	
}

export function trash_create<A extends schema.AtomName>(atom_name: A)
		:MongooseRelation<A>{
	urn_log.fn_debug(`Create MongooseTrashRelation`);
	return new MongooseTrashRelation<A>(atom_name);
}
