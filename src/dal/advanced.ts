/**
 * Class for Advanced Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../types';

import {SelfishDAL} from './selfish';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class AdvancedDAL<A extends AtomName> extends SelfishDAL<A>{}

export function create<A extends AtomName>(atom_name:A)
		:AdvancedDAL<A>{
	urn_log.fn_debug(`Create AdvancedDAL [${atom_name}]`);
	return new AdvancedDAL<A>(atom_name);
}

