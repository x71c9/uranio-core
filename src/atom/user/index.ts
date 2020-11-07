/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {urn_log} from 'urn-lib';

import * as urn_db from '../../db/';

import {AtomCreateFunction, AtomModule} from '../types';

import {Atom} from '../atom';

import {user_schema_definition} from './schema';

export namespace models {
	export type User = urn_mdls.resources.User;
}

const user_keys:urn_mdls.ModelKeysCategories<models.User> =
	urn_mdls.resources.user.keys;

/**
 * Class for Atom User
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class User extends Atom<models.User> implements urn_mdls.resources.User {
	
	public email:string;
	
	public username:string;
	
	public first_name:string;
	
	public last_name:string;
	
	public type:string;
	
	public active:boolean;
	
	public bio:string;
	
	public password:string;
	
	public readonly creation_date:Date;
	
	constructor(user:models.User){
		
		super(user);
		
		this.email = user.email;
		
		this.username = user.username;
		
		this.first_name = user.first_name;
		
		this.last_name = user.last_name;
		
		this.type = user.type;
		
		this.active = user.active;
		
		this.bio = user.bio;
		
		this.password = user.password;
		
		this.creation_date = user.creation_date;
		
	}
	
	protected _get_keys()
			:urn_mdls.ModelKeysCategories<models.User>{
		return user_keys;
	}
	
}

const schema:urn_db.Schema = new urn_db.Schema(user_schema_definition);

export type UserInstance = InstanceType<typeof User>;

const create:AtomCreateFunction<models.User, UserInstance> =
(user) => {
	urn_log.fn_debug(`Create user`);
	return new User(user);
};

export const module:AtomModule<models.User, User> = {
	keys: user_keys,
	create: create,
	schema: schema
};

