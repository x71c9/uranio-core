/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {DBType} from '../types';

import {DAL} from './abstract';

import * as urn_atms from '../atms/';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DALBin extends DAL<urn_atms.models.Trash, urn_atms.trash.TrashInstance> {
	
	constructor(db_type:DBType){
		super(db_type, urn_atms.trash.module);
	}
	
}

export type DalBinInstance = InstanceType<typeof DALBin>;

export default function create(db_type:DBType):DalBinInstance{
	urn_log.fn_debug(`Create DAL Users`);
	return new DALBin(db_type);
}



