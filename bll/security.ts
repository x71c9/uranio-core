/**
 * Security Class for Business Logic Layer
 *
 * This is a Business Logic Layer that force the use of the `user_group` in
 * order to initialise.
 *
 * If a `user_group` is defined the BLL will use an ACL - Access Control Layer
 * instead of a DAL - Data Access Layer without `user_group` control.
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName, TokenObject} from '../types';

import {BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class SecurityBLL<A extends AtomName> extends BasicBLL<A> {
	
	constructor(atom_name:A, token_object:TokenObject) {
		super(atom_name, token_object);
	}
	
}

export function create_security<A extends AtomName>(atom_name:A, token_object:TokenObject)
		:SecurityBLL<A>{
	urn_log.fn_debug(`Create SecurityBLL [${atom_name}]`);
	return new SecurityBLL<A>(atom_name, token_object);
}



