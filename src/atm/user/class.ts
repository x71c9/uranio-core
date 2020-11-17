/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {Atom} from '../abstract';

import {models} from '../types';

export const user_keys:models.ModelKeysCategories<models.User> =
	models.user.keys;

/**
 * Class for Atom User
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class User extends Atom<models.User> implements models.User {
	
	public email:string;
	
	public username:string;
	
	public first_name:string;
	
	public last_name:string;
	
	public type:string;
	
	public active:boolean;
	
	public password:string;
	
	constructor(user:models.User){
		
		super(user);
		
		this.email = user.email;
		
		this.username = user.username;
		
		this.first_name = user.first_name;
		
		this.last_name = user.last_name;
		
		this.type = user.type;
		
		this.active = user.active;
		
		this.password = user.password;
		
	}
	
	@urn_log.decorators.no_debug
	public get_keys()
			:models.ModelKeysCategories<models.User>{
		return user_keys;
	}
	
}
