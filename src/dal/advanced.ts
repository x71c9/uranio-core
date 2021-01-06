/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomName} from '../types';

import {AutoFixDAL} from './fix';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class AdvancedDAL<A extends AtomName> extends AutoFixDAL<A>{}

export function create<A extends AtomName>(atom_name:A)
		:AdvancedDAL<A>{
	urn_log.fn_debug(`Create AdvancedDAL [${atom_name}]`);
	return new AdvancedDAL<A>(atom_name);
}

