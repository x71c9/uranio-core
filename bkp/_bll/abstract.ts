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
	
	protected abstract create_atom(resource:M):A;
	
	public async search(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A[]>{
		return await this._dal.find(filter, options);
	}
	
	public async search_by_id(id:string)
			:Promise<A>{
		return await this._dal.find_by_id(id);
	}
	
	public async search_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A>{
		return await this._dal.find_one(filter, options);
	}
	
	public async save_one(resource:M)
			:Promise<A>{
		return await this._dal.insert_one(this.create_atom(resource));
	}
	
	public async update_one(resource:M)
			:Promise<A>{
		return await this._dal.alter_one(this.create_atom(resource));
	}
	
	public async remove_one(resource:M)
			:Promise<A>{
		return await this._dal.delete_one(this.create_atom(resource));
	}
	
}

