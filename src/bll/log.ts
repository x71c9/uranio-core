/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'uranio-utils';

import {schema} from '../sch/server';

import {BasicBLL} from './basic';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class LogBLL<A extends schema.LogName> extends BasicBLL<A>{
	constructor(log_name:A){
		super(log_name);
	}
}

export function create<A extends schema.LogName>(log_name:A)
		:LogBLL<A>{
	urn_log.trace(`Create LogBLL [${log_name}]`);
	return new BasicBLL<A>(log_name);
}

