/**
 * Custom BLL for Atom Users
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {Atom, AtomShape} from '../../types';

import {FinalBLL} from '../final';

import {create_basic} from '../basic';

const group_bll = create_basic('group');

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class UsersBLL extends FinalBLL<'user'>{
	
	constructor(user_groups:string[]){
		super('user', user_groups);
	}
	
	public async insert_new(atom_shape:AtomShape<'user'>)
			:Promise<Atom<'user'>>{
		const user = await super.insert_new(atom_shape);
		const group = await group_bll.insert_new({name: user.email});
		user.groups = [group._id];
		return await super.update_one(user);
	}
	
}

export function create_users(user_groups:string[]):UsersBLL{
	urn_log.fn_debug(`Create UsersBLL`);
	return new UsersBLL(user_groups);
}
