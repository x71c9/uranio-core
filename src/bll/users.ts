/**
 *
 * Implementation of Users Business Logic Layer
 *
 * @packageDocumentation
 */

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import {urn_log, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('USER_BLL', 'User Business Logic Layer');

import * as urn_atms from '../atm/';

import * as urn_dals from '../dal/';

import {BLL} from './abstract';

import {core_config} from '../defaults';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLLUsers extends BLL<urn_atms.models.User, urn_atms.user.UserInstance> {
	
	constructor(){
		super();
	}
	
	protected get_dal()
			:urn_dals.users.DalUsersInstance{
		return urn_dals.users.create(core_config.db_type);
	}
	
	protected create_atom(resource:urn_atms.models.User)
			:urn_atms.user.UserInstance{
		return urn_atms.user.module.create(resource);
	}
	
	public async save_one(resource:urn_atms.models.User){
		const user_atom = urn_atms.user.create(resource);
		const saltRounds = 10;
		try{
			const crypt_password = await bcrypt.hash(user_atom.password, saltRounds);
			user_atom.password = crypt_password;
		}catch(err){
			const err_msg = `Cannot hash password.`;
			throw urn_exc.create('CANNOT_HASH_PASSWORD', err_msg);
		}
		return super.save_one(user_atom);
	}
	
	public async authenticate(auth_req:urn_atms.models.UserAuth)
			:Promise<string>{
		if(typeof auth_req !== 'object' || auth_req === null){
			const user_auth_type = (typeof auth_req === 'object') ? 'null' : typeof auth_req;
			let err_msg = `Invalid request type.`;
			err_msg += ` Request type must be of type "object" - given type [${user_auth_type}].`;
			throw urn_exc.create('AUTH_INVALID_REQUEST_TYPE', err_msg);
		}
		if(!auth_req.email || typeof auth_req.email !== 'string'){
			const err_msg = `Invalid request property email type.`;
			throw urn_exc.create('AUTH_INVALID_EMAIL_TYPE', err_msg);
		}
		if(!auth_req.password || typeof auth_req.password !== 'string'){
			const err_msg = `Invalid request property password type.`;
			throw urn_exc.create('AUTH_INVALID_PASSWORD_TYPE', err_msg);
		}
		if(urn_util.is.email(auth_req.email) !== true){
			const err_msg = `Invalid request property email.`;
			throw urn_exc.create('AUTH_INVALID_EMAIL', err_msg);
		}
		
		const user_find_one = await this._dal.find_one({email: auth_req.email});
		
		const is_valid_password = await bcrypt.compare(auth_req.password, user_find_one.password);
		if(is_valid_password !== true){
			const err_msg = `Invalid password.`;
			throw urn_exc.create('AUTH_INVALID_PASSWORD', err_msg);
		}
		
		const token = jwt.sign(user_find_one.get_token_object(), core_config.jwt_private_key);
		
		return token;
		
	}
}

export type BllUsersInstance = InstanceType<typeof BLLUsers>;

export function create():BllUsersInstance{
	urn_log.fn_debug(`Create BLL Users`);
	return new BLLUsers();
}



