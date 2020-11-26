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

import {core_default_config} from '../defaults';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLLUsers extends BLL<urn_atms.models.User, urn_atms.user.UserInstance> {
	
	constructor(){
		super();
	}
	
	protected get_dal():urn_dals.users.DalUsersInstance{
		return urn_dals.users.create(core_default_config.db_type);
	}
}

export type BllUsersInstance = InstanceType<typeof BLLUsers>;

export function create():BllUsersInstance{
	urn_log.fn_debug(`Create DAL Users`);
	return new BLLUsers();
}



