/**
 * Class for Authentication Business Logic Layer
 *
 * @packageDocumentation
 */

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import {urn_util, urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('USERSBLL', 'Users BLL');

import {core_config} from '../conf/defaults';

import {AuthName, Query, AuthAtom} from '../types';

import * as urn_atm from '../atm/';

import {create_basic, BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class AuthenticateBLL<A extends AuthName> {
	
	private _basic_bll:BasicBLL<A>;
	
	constructor(private _atom_name:A){
		this._basic_bll = create_basic<A>(this._atom_name);
	}
	
	public async authenticate(email: string, password: string)
			:Promise<string>{
		urn_atm.validate_atom_partial<A>(this._atom_name, {email: email, password: password} as any);
		const user_atom = await this._basic_bll.find_one({email: email} as Query<A>) as AuthAtom<A>;
		if(!urn_util.object.has_key(user_atom, 'password')){
			throw urn_exc.create_invalid_atom('INVALID_AUTH_ATOM', 'Invalid atom. No password.', user_atom, ['password']);
		}
		if(!urn_util.object.has_key(user_atom, 'groups')){
			throw urn_exc.create_invalid_atom('INVALID_AUTH_ATOM', 'Invalid atom. No groups.', user_atom, ['groups']);
		}
		const compare_result = await bcrypt.compare(password, user_atom.password);
		if(!compare_result){
			throw urn_exc.create_invalid_request('AUTH_INVALID_PASSWORD', `Invalid password.`);
		}
		const token = jwt.sign({_id: user_atom._id, atom: this._atom_name, groups: (user_atom as any).groups}, core_config.jwt_private_key);
		return token;
	}
	
}

export type AuthBLLInstance = InstanceType<typeof AuthenticateBLL>;

export function create_auth<A extends AuthName>(atom_name:A)
		:AuthenticateBLL<A>{
	urn_log.fn_debug(`Create AuthenticateBLL`);
	return new AuthenticateBLL<A>(atom_name);
}



