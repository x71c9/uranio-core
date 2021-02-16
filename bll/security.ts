/**
 * Security Class for Business Logic Layer
 *
 * This is a Business Logic Layer that force the use of a token_object in
 * order to initialise.
 *
 * It uses an Access Control Layer (ACL) instead of a Data Access Layer (DAL).
 *
 * If the token_object is a superuser it uses a DAL.
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_acl from '../acl/';

import * as urn_dal from '../dal/';

import {AtomName, TokenObject, AccessLayer} from '../types';

import {BasicBLL} from './basic';

import {is_superuser, is_valid_token_object} from './authenticate';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class SecurityBLL<A extends AtomName> extends BasicBLL<A> {
	
	constructor(atom_name:A, _token_object?:TokenObject) {
		super(atom_name, _return_acl(atom_name, _token_object));
	}
	
}

function _return_acl<A extends AtomName>(atom_name:A, token_object?:TokenObject) {
	return ():AccessLayer<A> => {
		
		let groups:string[] = [];

		if(token_object){
			
			is_valid_token_object(token_object);
			
			if(is_superuser(token_object)){
				return urn_dal.create(atom_name);
			}
			
			if(Array.isArray(token_object.groups)){
				groups = token_object.groups;
			}
			
		}
		
		return urn_acl.create(atom_name, groups);
		
	};
}


export function create_security<A extends AtomName>(atom_name:A, token_object?:TokenObject)
		:SecurityBLL<A>{
	urn_log.fn_debug(`Create SecurityBLL [${atom_name}]`);
	return new SecurityBLL<A>(atom_name, token_object);
}



