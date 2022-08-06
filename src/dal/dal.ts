/**
 * Default Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {schema} from '../sch/server';

import {SelfishDAL} from './selfish';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class DAL<A extends schema.AtomName> extends SelfishDAL<A>{}

export function create<A extends schema.AtomName>(atom_name:A)
		:DAL<A>{
	urn_log.trace(`Create DAL [${atom_name}]`);
	return new DAL<A>(atom_name);
}

