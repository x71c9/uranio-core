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

import {schema} from '../sch/server';

import * as conf from '../conf/server';

import * as urn_acl from '../acl/server';

import * as urn_dal from '../dal/server';

import {Passport} from '../typ/auth';

import {AccessLayer} from '../typ/layer';

import {BasicBLL} from './basic';

import {is_superuser, is_valid_passport} from './authenticate';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class SecurityBLL<A extends schema.AtomName> extends BasicBLL<A> {
	
	constructor(atom_name:A, _passport?:Passport) {
		super(atom_name, _return_acl(atom_name, _passport));
	}
	
}

function _return_acl<A extends schema.AtomName>(atom_name:A, passport?:Passport) {
	return ():AccessLayer<A> => {
		
		if(conf.get('default_atoms_superuser') === false){
			return urn_dal.create(atom_name);
		}
		
		let groups:string[] = [];
	
		// If a Passport is passed and it is a superuser
		// then bypass ACL and return a DAL.
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


export function create_security<A extends schema.AtomName>(atom_name:A, passport?:Passport)
		:SecurityBLL<A>{
	urn_log.trace(`Create SecurityBLL [${atom_name}]`);
	return new SecurityBLL<A>(atom_name, passport);
}



