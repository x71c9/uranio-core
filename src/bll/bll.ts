/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

// import * as urn_atm from '../atm/';

import * as urn_dal from '../dal/';

import {
	Query,
	AtomName,
	Atom,
	AtomShape,
	Depth,
	Molecule
} from '../types';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class BLL<A extends AtomName> {
	
	protected _dal:urn_dal.DAL<A>;
	
	constructor(public atom_name:A) {
		this._dal = urn_dal.create<A>(atom_name);
	}
	
	public async find<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		return await this._dal.select(query, options);
	}
	
	public async find_by_id<D extends Depth>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		return await this._dal.select_by_id(id, depth);
	}
	
	public async find_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		return await this._dal.select_one(query, options);
	}
	
	public async insert_new(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		return await this._dal.insert_one(atom_shape);
	}
	
	public async update_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		return await this._dal.alter_by_id(id, partial_atom);
	}
	
	public async update_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this.update_by_id(atom._id, atom);
	}
	
	public async remove_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._dal.delete_by_id(id);
	}
	
	public async remove_one(molecule:Molecule<A>)
			:Promise<Atom<A>>{
		return await this.remove_by_id(molecule._id);
	}
	
}

// export type BllInstance = InstanceType<typeof BLL>;

export function create<A extends AtomName>(atom_name:A):BLL<A>{
	urn_log.fn_debug(`Create BLL [${atom_name}]`);
	return new BLL<A>(atom_name);
}



