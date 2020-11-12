/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {DBType} from '../types';

import {DAL} from './abstract';

import * as urn_atms from '../atms/';

@urn_log.decorators.debug_methods
export abstract class DALResources
<M extends urn_atms.models.Resource, A extends urn_atms.Atom<M>> extends DAL<M,A>{
	
	constructor(db_type:DBType, atom_module:urn_atms.AtomModule<M,A>){
		super(db_type, atom_module);
	}
	
	public async delete_one(atom:A):Promise<A | null>{
		return super.delete_one(atom);
	}
	
}



