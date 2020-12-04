/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {DatabaseType, AtomDefinition} from '../types';

import * as urn_atms from '../atm/';

import {DAL} from './abstract';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DALGeneral extends DAL<urn_atms.models.Resource, urn_atms.Atom<urn_atms.models.Resource>> {
	
	constructor(db_type:DatabaseType, atom_definition:AtomDefinition){
		super(db_type, atom_definition);
	}
	
}

export type DalGeneralInstance = InstanceType<typeof DALGeneral>;

export function create(db_type:DatabaseType, atom_definition:AtomDefinition):DalGeneralInstance{
	urn_log.fn_debug(`Create DAL General`);
	return new DALGeneral(db_type, atom_definition);
}



