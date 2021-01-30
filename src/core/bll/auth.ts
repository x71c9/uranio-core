/**
 * Class for Authentication Business Logic Layer
 *
 * @packageDocumentation
 */

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('USERSBLL', 'Users BLL');

import {core_config} from '../conf/defaults';

import * as urn_atm from '../atm/';

import {BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class AuthBLL extends BasicBLL<'user'>{
	
	constructor(){
		super('user');
	}
	
	public async authenticate(email: string, password: string)
			:Promise<string>{
		urn_atm.validate_atom_partial('user', {email: email, password: password});
		const user = await this._al.select_one({email: email});
		const compare_result = await bcrypt.compare(password, user.password);
		if(!compare_result){
			throw urn_exc.create('AUTH_INVALID_PASSWORD', `Invalid password.`);
		}
		const token = jwt.sign({user: {_id: user._id, groups: user.groups}}, core_config.jwt_private_key);
		return token;
	}
	
}

export function create_users():AuthBLL{
	urn_log.fn_debug(`Create AuthBLL`);
	return new AuthBLL();
}



