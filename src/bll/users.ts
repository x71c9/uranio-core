/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_atms from '../atm/';

import * as urn_dals from '../dal/';

import {BLL} from './abstract';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLLUsers extends BLL<urn_atms.models.User, urn_atms.user.UserInstance> {
	
	constructor(){
		super();
	}
	
	protected get_dal(){
		return urn_dals.users.create('mongo');
	}
}

export type BllUsersInstance = InstanceType<typeof BLLUsers>;

export function create():BllUsersInstance{
	urn_log.fn_debug(`Create DAL Users`);
	return new BLLUsers();
}



