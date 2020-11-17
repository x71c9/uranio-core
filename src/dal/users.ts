/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {DBType} from '../types';

import * as urn_atm from '../atm/';

import {DAL} from './abstract';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DALUsers extends DAL<urn_atm.models.User, urn_atm.user.UserInstance> {
	
	constructor(db_type:DBType){
		super(db_type, urn_atm.user.module);
	}
	
}

export type DalUsersInstance = InstanceType<typeof DALUsers>;

export function create(db_type:DBType):DalUsersInstance{
	urn_log.fn_debug(`Create DAL Users`);
	return new DALUsers(db_type);
}



