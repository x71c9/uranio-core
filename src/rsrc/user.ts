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
class URNUser extends Resource implements urn_mdls.resources.User {
	
	public email:string;
	
	public username:string;
	
	public first_name:string;
	
	public last_name:string;
	
	public type:string;
	
	public active:boolean;
	
	public bio:string;
	
	public password:string;
	
	public readonly creation_date:Date;
	
	constructor(user:urn_mdls.resources.User){
		
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
	
}

export type UserInstance = InstanceType<typeof URNUser>;

export default function create_instance(user:urn_mdls.resources.User)
		:UserInstance{
	return new URNUser(user);
}
