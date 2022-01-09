/**
 * Security Class for Business Logic Layer
 *
 * This is a Business Logic Layer that force the use of a passport in
 * order to initialise.
 *
 * It uses an Access Control Layer (ACL) instead of a Data Access Layer (DAL).
 *
 * If the passport is a superuser it uses a DAL.
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_acl from '../acl/';

import * as urn_dal from '../dal/';

import {AtomName} from '../typ/atom';

import {Passport} from '../typ/auth';

import {AccessLayer} from '../typ/layer';

import {BasicBLL} from './basic';

import {is_superuser, is_valid_passport} from './authenticate';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class SecurityBLL<A extends AtomName> extends BasicBLL<A> {
	
	constructor(atom_name:A, _passport?:Passport) {
		super(atom_name, _return_acl(atom_name, _passport));
	}
	
}

function _return_acl<A extends AtomName>(atom_name:A, passport?:Passport) {
	return ():AccessLayer<A> => {
		
		let groups:string[] = [];
		
		if(passport){
			
			is_valid_passport(passport);
			
			if(is_superuser(passport)){
				return urn_dal.create(atom_name);
			}
			
			if(Array.isArray(passport.groups)){
				groups = passport.groups;
			}
			
		}
		
		return urn_acl.create(atom_name, groups);
		
	};
}


export function create_security<A extends AtomName>(atom_name:A, passport?:Passport)
		:SecurityBLL<A>{
	urn_log.fn_debug(`Create SecurityBLL [${atom_name}]`);
	return new SecurityBLL<A>(atom_name, passport);
}



