/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {DatabaseType} from '../types';

import * as urn_atms from '../atm/';

import {DAL} from './abstract';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DALUsers extends DAL<urn_atms.models.User, urn_atms.user.UserInstance> {
	
	constructor(db_type:DatabaseType){
		super(db_type, urn_atms.user.module);
	}
	
}

export type DalUsersInstance = InstanceType<typeof DALUsers>;

export function create(db_type:DatabaseType):DalUsersInstance{
	urn_log.fn_debug(`Create DAL Users`);
	return new DALUsers(db_type);
}



