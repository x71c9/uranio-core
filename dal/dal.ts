/**
 * Default Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../typ/atom';

import {SelfishDAL} from './selfish';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class DAL<A extends AtomName> extends SelfishDAL<A>{}

export function create<A extends AtomName>(atom_name:A)
		:DAL<A>{
	urn_log.fn_debug(`Create DAL [${atom_name}]`);
	return new DAL<A>(atom_name);
}

