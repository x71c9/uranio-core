/**
 * Class for Authentication Business Logic Layer
 *
 * @packageDocumentation
 */

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import {urn_util, urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('AUTHENTICATION_BLL', 'Authentication BLL');

// import schema from 'uranio-schema';

import {schema} from '../sch/';

import * as conf from '../conf/';

import {
	BookSecurity,
	BookPermission,
} from '../typ/book_srv';

import {abstract_passport} from '../stc/';

import {
	Passport,
	AuthAction
} from '../typ/auth';

import {PassportKey} from '../typ/intra';

import * as atm_validate from '../atm/validate';

import * as atm_util from '../atm/util';

import * as book from '../book/';

import {create as create_basic, BasicBLL} from './basic';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class AuthenticationBLL<A extends schema.AuthName> {
	
	private _basic_bll:BasicBLL<A>;
	
	constructor(private _atom_name:A){
		this._basic_bll = create_basic<A>(this._atom_name);
	}
	
	public async get_passport(token: string):Promise<Passport>{
		const decoded_token = jwt.verify(token, conf.get(`jwt_private_key`));
		return decoded_token as Passport;
	}
	
	public async authenticate(email: string, password: string)
			:Promise<string>{
		atm_validate.atom_partial<A>(this._atom_name, {email: email, password: password} as Partial<schema.AuthAtomShape<A>>);
		let auth_atom;
		try {
			auth_atom = await this._basic_bll.find_one({email: email} as schema.Query<A>) as schema.AuthAtom<A>;
		}catch(e){
			const err = e as any;
			if(err.type === urn_exception.ExceptionType.NOT_FOUND){
				throw urn_exc.create_auth_not_found(err.error_code, err.msg, err);
			}
			throw err;
		}
		if(!atm_util.is_auth_atom(auth_atom)){
			throw urn_exc.create_invalid_atom('INVALID_AUTH_ATOM', 'Invalid Auth schema.Atom.', auth_atom, ['email', 'password', 'groups']);
		}
		const compare_result = await bcrypt.compare(password, auth_atom.password);
		if(!compare_result){
			throw urn_exc.create_auth_invalid_password('AUTH_INVALID_PASSWORD', `Invalid password.`);
		}
		return this._generate_token(auth_atom);
	}
	
	private _generate_passport(auth_atom:schema.AuthAtom<A>)
			:Passport{
		return {
			_id: auth_atom._id,
			auth_atom_name: this._atom_name,
			groups: auth_atom.groups
		};
	}
	
	private _generate_token(auth_atom:schema.AuthAtom<A>)
			:string{
		const passport = this._generate_passport(auth_atom);
		return jwt.sign(passport, conf.get(`jwt_private_key`));
	}
	
}

export type AuthenticationBLLInstance = InstanceType<typeof AuthenticationBLL>;

export function create<A extends schema.AuthName>(atom_name:A)
		:AuthenticationBLL<A>{
	urn_log.fn_debug(`Create AuthenticationBLL [${atom_name}]`);
	return new AuthenticationBLL<A>(atom_name);
}

export function is_public_request<A extends schema.AtomName>(atom_name:A, action: AuthAction)
		:boolean{
	const atom_def = book.get_definition(atom_name);
	
	if(action === AuthAction.READ){
	
		if(
			!atom_def.security ||
			atom_def.security === BookSecurity.UNIFORM
		){
			return true;
		}
		
		if(
			typeof atom_def.security === 'object' &&
			atom_def.security.type === BookSecurity.UNIFORM &&
			atom_def.security._r === undefined
		){
			return true;
		}
		
		return false;
		
	}else if(action === AuthAction.WRITE){
		
		if(
			typeof atom_def.security === 'object' &&
			atom_def.security.type === BookSecurity.UNIFORM &&
			atom_def.security._w === BookPermission.PUBLIC
		){
			return true;
		}
		
		return false;
		
	}
	
	return false;
	
}

export function is_valid_passport(passport:Passport)
		:true{
	// _token_is_object(passport);
	passport_has_all_keys(passport);
	passport_has_no_other_keys(passport);
	passport_has_correct_type_values(passport);
	// await _if_superuser_validate_id(passport);
	return true;
}

// function _token_is_object(passport:Passport)
//   :true{
//   if(!passport){
//     throw urn_exc.create_invalid_request('TOKEN_UNDEFINED', 'Token is missing.');
//   }
//   if(typeof passport !== 'object'){
//     throw urn_exc.create_invalid_request('TOKEN_INVALID_TYPE', 'Token has wrong type.');
//   }
//   return true;
// }

function passport_has_all_keys(passport:Passport)
		:true{
	for(const k in abstract_passport){
		if(!urn_util.object.has_key(passport, k)){
			throw urn_exc.create_invalid_request('PASSPORT_MISSING_KEY', `Passport is missing key \`${k}\`.`);
		}
	}
	return true;
}

function passport_has_no_other_keys(passport:Passport)
		:true{
	for(const [k] of Object.entries(passport)){
		if(k === 'iat'){
			continue;
		}
		if(!urn_util.object.has_key(abstract_passport, k)){
			throw urn_exc.create_invalid_request('PASSPORT_INVALID_KEY', `Passport have invalid keys \`${k}\`.`);
		}
	}
	return true;
}

function passport_has_correct_type_values(passport:Passport)
		:true{
	let k:PassportKey;
	for(k in abstract_passport){
		_check_passport_key_type(passport, k);
	}
	return true;
}

function _check_passport_key_type(passport:Passport, key:PassportKey)
		:true{
	switch(abstract_passport[key]){
		case 'string':{
			if(typeof passport[key] !== 'string'){
				const err_msg = 'Invalid passport.';
				throw urn_exc.create_invalid_request('PASSPORT_INVALID_VALUE_TYPE', err_msg);
			}
			return true;
		}
		case 'string[]':{
			if(!Array.isArray(passport[key])){
				const err_msg = 'Invalid passport.';
				throw urn_exc.create_invalid_request('PASSPORT_INVALID_VALUE_TYPE', err_msg);
			}
			return true;
		}
	}
}

export function is_superuser(passport?:Passport)
		:boolean{
	if(
		passport &&
		typeof passport === 'object' &&
		passport.auth_atom_name === 'superuser'
	){
		return true;
	}
	return false;
}

// async function _if_superuser_validate_id(passport:Passport)
//     :Promise<true>{
//   if(passport.auth_atom_name !== 'superuser'){
//     return true;
//   }
		
//   return true;
	
//   // try{
//   //   const basic_superusers_bll = create_basic('superuser');
//   //   await basic_superusers_bll.find_by_id(passport._id);
//   //   return true;
//   // }catch(ex){
//   //   const err_msg = 'Invalid passport object _id.';
//   //   throw urn_exc.create_invalid_request('INVALID_TOKEN_SU_ID', err_msg);
//   // }
// }


