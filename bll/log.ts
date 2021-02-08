/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {BasicBLL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class LogBLL extends BasicBLL<'log'>{}

export function create_log()
		:LogBLL{
	urn_log.fn_debug(`Create LogBLL`);
	return new BasicBLL<'log'>('log');
}



