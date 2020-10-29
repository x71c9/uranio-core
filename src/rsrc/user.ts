/**
 * Module for Resource User class
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {urn_log} from 'urn-lib';

import {Resource} from './resource';

/**
 * Class for Resource User
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class User extends Resource implements urn_mdls.resources.User {
	
	public email:string;

	public username:string;
	
	constructor(user:urn_mdls.resources.User){
		super(user);
		let k:keyof urn_mdls.resources.User;
		for(k in user){
			console.log(user[k]);
			this[k] = user[k];
		}
	}
	
}

export type UserInstance = InstanceType<typeof User>;

export default function create_instance(user:urn_mdls.resources.User)
		:UserInstance{
	return new User(user);
}
