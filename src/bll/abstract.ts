/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_atms from '../atm/';

import * as urn_dals from '../dal/';

import {QueryOptions, FilterType} from '../types';

@urn_log.decorators.debug_methods
export abstract class BLL<M extends urn_atms.models.Resource, A extends urn_atms.Atom<M>> {
	
	protected _dal:urn_dals.DAL<M,A>;
	
	constructor() {
		this._dal = this.get_dal();
	}

	protected abstract get_dal():urn_dals.DAL<M,A>;
	
	public async find(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A[]>{
		return await this._dal.find(filter, options);
	}
	
	public async find_by_id(id:string)
			:Promise<A>{
		return await this._dal.find_by_id(id);
	}
	
	public async find_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A>{
		return await this._dal.find_one(filter, options);
	}
	
	public async insert_one(atom:A)
			:Promise<A>{
		return await this._dal.insert_one(atom);
	}
	
	public async update_one(atom:A)
			:Promise<A>{
		return await this._dal.update_one(atom);
	}
	
	public async delete_one(atom:A)
			:Promise<A>{
		return await this._dal.delete_one(atom);
	}
	
}

