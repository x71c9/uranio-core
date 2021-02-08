/**
 * Class for Advanced Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {DAL} from './dal';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class LogDAL extends DAL<'log'>{
	constructor(){
		super('log');
	}
}

export function create_log()
		:LogDAL{
	urn_log.fn_debug(`Create LogDAL`);
	return new LogDAL();
}

