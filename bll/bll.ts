/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../types';

import {FinalBLL} from './final';

import {create_users, UsersBLL} from './users/';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLL<A extends AtomName> extends FinalBLL<A>{}

export function create<A extends AtomName>(atom_name:A, user_groups:string[]):BLL<A>;
export function create(atom_name:'user', user_groups:string[]):UsersBLL;
export function create<A extends AtomName>(atom_name:A, user_groups:string[]):BLL<A>|UsersBLL{
	urn_log.fn_debug(`Create BLL [${atom_name}]`);
	switch(atom_name){
		case 'user':{
			return create_users(user_groups);
		}
	}
	return new BLL<A>(atom_name, user_groups);
}



