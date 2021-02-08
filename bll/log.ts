/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {LogName} from '../types';

import {BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class LogBLL<A extends LogName> extends BasicBLL<A>{}

export function create_log<A extends LogName>(log_name:A)
		:LogBLL<A>{
	urn_log.fn_debug(`Create LogBLL [${log_name}]`);
	return new BasicBLL<A>(log_name);
}



