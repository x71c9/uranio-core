/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../types';

import {BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class SecurityBLL<A extends AtomName> extends BasicBLL<A> {
	
	constructor(atom_name:A, user_groups:string[]) {
		super(atom_name, user_groups);
	}
	
}

export function create_security<A extends AtomName>(atom_name:A, user_groups:string[])
		:SecurityBLL<A>{
	urn_log.fn_debug(`Create SecurityBLL [${atom_name}]`);
	return new SecurityBLL<A>(atom_name, user_groups);
}



