/**
 * Class for Authentication Business Logic Layer
 *
 * @packageDocumentation
 */

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import {urn_util, urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('AUTHENTICATION_BLL', 'Authentication BLL');

import {core_config} from '../conf/defaults';

import {
	AuthName,
	Query,
	AuthAtom,
	AuthAtomShape,
	TokenObject,
	abstract_token_object,
	TokenKey
} from '../types';

import * as atm_validate from '../atm/validate';

import * as atm_util from '../atm/util';

import {create as create_basic, BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class AuthenticationBLL<A extends AuthName> {
	
	private _basic_bll:BasicBLL<A>;
	
	constructor(private _atom_name:A){
		this._basic_bll = create_basic<A>(this._atom_name);
	}
	
	public async authenticate(email: string, password: string)
			:Promise<string>{
		atm_validate.atom_partial<A>(this._atom_name, {email: email, password: password} as Partial<AuthAtomShape<A>>);
		const auth_atom = await this._basic_bll.find_one({email: email} as Query<A>) as AuthAtom<A>;
		if(!atm_util.is_auth_atom(auth_atom)){
			throw urn_exc.create_invalid_atom('INVALID_AUTH_ATOM', 'Invalid Auth Atom.', auth_atom, ['email', 'password', 'groups']);
		}
		const compare_result = await bcrypt.compare(password, auth_atom.password);
		if(!compare_result){
			throw urn_exc.create_invalid_request('AUTH_INVALID_PASSWORD', `Invalid password.`);
		}
		return this._generate_token(auth_atom);
	}
	
	private _generate_token_object(auth_atom:AuthAtom<A>)
			:TokenObject{
		return {
			_id: auth_atom._id,
			auth_atom_name: this._atom_name,
			groups: auth_atom.groups
		};
	}
	
	private _generate_token(auth_atom:AuthAtom<A>)
			:string{
		const token_object = this._generate_token_object(auth_atom);
		return jwt.sign(token_object, core_config.jwt_private_key);
	}
	
}

export type AuthenticationBLLInstance = InstanceType<typeof AuthenticationBLL>;

export function create<A extends AuthName>(atom_name:A)
		:AuthenticationBLL<A>{
	urn_log.fn_debug(`Create AuthenticationBLL [${atom_name}]`);
	return new AuthenticationBLL<A>(atom_name);
}


export async function is_valid_token_object(token_object:TokenObject)
		:Promise<true>{
	_token_is_object(token_object);
	_token_has_all_keys(token_object);
	_token_has_no_other_keys(token_object);
	_token_has_correct_type_values(token_object);
	await _if_superuser_validate_id(token_object);
	return true;
}

function _token_is_object(token_object:TokenObject)
	:true{
	if(!token_object || typeof token_object !== 'object'){
		throw urn_exc.create_invalid_request('TOKEN_INVALID_TYPE', 'Token has wrong type.');
	}
	return true;
}

function _token_has_all_keys(token_object:TokenObject)
		:true{
	for(const k in abstract_token_object){
		if(!urn_util.object.has_key(token_object, k)){
			throw urn_exc.create_invalid_request('TOKEN_MISSING_KEY', `Token is missing key [${k}].`);
		}
	}
	return true;
}

function _token_has_no_other_keys(token_object:TokenObject)
		:true{
	for(const [k] of Object.entries(token_object)){
		if(k === 'iat'){
			continue;
		}
		if(!urn_util.object.has_key(abstract_token_object, k)){
			throw urn_exc.create_invalid_request('TOKEN_INVALID_KEY', `Token have invalid keys [${k}].`);
		}
	}
	return true;
}

function _token_has_correct_type_values(token_object:TokenObject)
		:true{
	let k:TokenKey;
	for(k in abstract_token_object){
		_check_token_key_type(token_object, k);
	}
	return true;
}

function _check_token_key_type(token_object:TokenObject, key:TokenKey)
		:true{
	switch(abstract_token_object[key]){
		case 'string':{
			if(typeof token_object[key] !== 'string'){
				const err_msg = 'Invalid token.';
				throw urn_exc.create_invalid_request('TOKEN_INVALID_VALUE_TYPE', err_msg);
			}
			return true;
		}
		case 'string[]':{
			if(!Array.isArray(token_object[key])){
				const err_msg = 'Invalid token.';
				throw urn_exc.create_invalid_request('TOKEN_INVALID_VALUE_TYPE', err_msg);
			}
			return true;
		}
	}
}

async function _if_superuser_validate_id(token_object:TokenObject)
		:Promise<true>{
	if(token_object.auth_atom_name !== 'superuser'){
		return true;
	}
		
	return true;
	
	// try{
	//   const basic_superusers_bll = create_basic('superuser');
	//   await basic_superusers_bll.find_by_id(token_object._id);
	//   return true;
	// }catch(ex){
	//   const err_msg = 'Invalid token object _id.';
	//   throw urn_exc.create_invalid_request('INVALID_TOKEN_SU_ID', err_msg);
	// }
}


