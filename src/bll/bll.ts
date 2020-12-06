/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_atm from '../atm/';

import * as urn_dal from '../dal/';

import {QueryOptions, FilterType} from '../types';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLL<M> {
	
	private _dal:urn_dal.DalInstance;
	
	constructor(public atom_name:string) {
		this._dal = urn_dal.create(atom_name);
	}
	
	public async find(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<urn_atm.AtomInstance[]>{
		return await this._dal.select(filter, options);
	}
	
	public async find_by_id(id:string)
			:Promise<urn_atm.AtomInstance>{
		return await this._dal.select_by_id(id);
	}
	
	public async find_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<urn_atm.AtomInstance>{
		return await this._dal.select_one(filter, options);
	}
	
	public async save_one(resource:M)
			:Promise<urn_atm.AtomInstance>{
		const atom = urn_atm.create(this.atom_name, resource);
		return await this._dal.insert_one(atom);
	}
	
	public async update_one(resource:M)
			:Promise<urn_atm.AtomInstance>{
		const atom = urn_atm.create(this.atom_name, resource);
		return await this._dal.alter_one(atom);
	}
	
	public async remove_one(resource:M)
			:Promise<urn_atm.AtomInstance>{
		const atom = urn_atm.create(this.atom_name, resource);
		return await this._dal.delete_one(atom);
	}
	
}

export type BllInstance = InstanceType<typeof BLL>;

export function create(atom_name:string):BllInstance{
	urn_log.fn_debug(`Create BLL`);
	return new BLL(atom_name);
}

