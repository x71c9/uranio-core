/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import urn_mdls from 'urn-mdls';

import * as urn_atom from '../atom/';

import {DAL} from './dal';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DALUsers extends DAL<urn_mdls.resources.User, urn_atom.user.User> {
	
	constructor(){
		super('urn_user');
	}
	
	protected _get_atom_create(){
		return urn_atom.user.create;
	}
	
	protected _get_approved_keys(){
		return urn_mdls.resources.user.keys.approved;
	}
	
	protected _get_schema_definition(){
		return {
			first_name: {
				type: String,
				trim: true,
				match: /^[a-zA-z -]+$/,
				set: (v:string) =>
					(v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1){
						return $1.toUpperCase();
					}),
				minlenght: 2,
				maxlenght: 255,
				required: true
			},
			last_name: {
				type: String,
				trim: true,
				match: /^[a-zA-z -]+$/,
				set: (v:string) =>
					(v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1){
						return $1.toUpperCase();
					}),
				minlenght: 2,
				maxlenght: 255,
				required: true
			},
			username: {
				type: String,
				trim: true,
				lowercase: true,
				match: /^[a-z0-9_-]+$/,
				minlenght: 3,
				maxlenght: 255,
				unique: true,
				required: true
			},
			email:{
				type: String,
				trim: true,
				lowercase: true,
				// match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				maxlenght: 255,
				unique: true,
				required: true
			},
			type:{
				type: String,
				default: 'default',
				enum: ['default','pro'],
				required: true
			},
			date: {
				type: Date,
				default: Date.now
			},
			active: {
				type: Boolean,
				default: false,
				required: true
			},
			bio:{
				type: String,
				trim: true
			},
			password:{
				type: String,
				trim: true,
				match: /^[^ \t\r+]+$/,
				minlenght: 8,
				maxlenght: 255,
				required: true
			}
		};
	}
	
}

export type DalUsersInstance = InstanceType<typeof DALUsers>;

export default function create():DalUsersInstance{
	return new DALUsers();
}



