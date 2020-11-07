/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_atom from '../atom/';

import {DAL} from './dal';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DALUsers extends DAL<urn_atom.user.models.User, urn_atom.user.UserInstance> {
	
	constructor(){
		super('urn_user', urn_atom.user.module);
	}
	
}

export type DalUsersInstance = InstanceType<typeof DALUsers>;

export default function create():DalUsersInstance{
	return new DALUsers();
}



