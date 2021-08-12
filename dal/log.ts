/**
 * Class for Advanced Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {LogName} from '../typ/atom';

import {DAL} from './dal';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class LogDAL<A extends LogName> extends DAL<A>{
	constructor(log_name:A){
		super(log_name);
	}
}

export function create_log<A extends LogName>(log_name:A)
		:LogDAL<A>{
	urn_log.fn_debug(`Create LogDAL [${log_name}]`);
	return new LogDAL(log_name);
}

