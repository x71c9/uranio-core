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

// import {is_valid_token_object} from './authenticate';

import {is_superuser} from './authenticate';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class SecurityBLL<A extends AtomName> extends BasicBLL<A> {
	
	constructor(atom_name:A, protected _token_object?:TokenObject) {
		super(atom_name);
	}
	
	protected _get_access_layer():AccessLayer<A>{
		if(is_superuser(this._token_object)){
			return urn_dal.create(this.atom_name);
		}
		const groups = (this._token_object?.groups && Array.isArray(this._token_object.groups)) ?
			this._token_object.groups : [];
		return urn_acl.create(this.atom_name, groups);
	}
	
}

export function create_security<A extends AtomName>(atom_name:A, token_object?:TokenObject)
		:SecurityBLL<A>{
	urn_log.fn_debug(`Create SecurityBLL [${atom_name}]`);
	return new SecurityBLL<A>(atom_name, token_object);
}



