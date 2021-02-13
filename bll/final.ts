/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../types';

import {SecurityBLL} from './security';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class FinalBLL<A extends AtomName> extends SecurityBLL<A>{}

export function create_final<A extends AtomName>(atom_name:A, user_groups:string[])
		:FinalBLL<A>{
	urn_log.fn_debug(`Create FinalBLL [${atom_name}]`);
	return new FinalBLL<A>(atom_name, user_groups);
}



