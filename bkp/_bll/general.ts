/**
 *
 * Implementation of Users Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomDefinition} from '../types';

import * as urn_atms from '../atm/';

import * as urn_dals from '../dal/';

import {BLL} from './abstract';

import {core_config} from '../defaults';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLLGeneral extends BLL<urn_atms.models.Resource, urn_atms.Atom<urn_atms.models.Resource>> {
	
	constructor(private atom_definition:AtomDefinition){
		super();
	}
	
	protected get_dal()
			:urn_dals.general.DalGeneralInstance{
		return urn_dals.general.create(core_config.db_type, this.atom_definition);
	}
	
	protected create_atom(resource:urn_atms.models.Resource)
			:urn_atms.Atom{
		return urn_atms.create(atom_name, resource);
	}
	
}

export type BllGeneralInstance = InstanceType<typeof BLLGeneral>;

export function create(atom_definition:AtomDefinition):BllGeneralInstance{
	urn_log.fn_debug(`Create BLL General`);
	return new BLLGeneral(atom_definition);
}



