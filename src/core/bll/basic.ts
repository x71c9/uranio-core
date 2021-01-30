/**
 * Class for Basic Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_dal from '../dal/';

import * as urn_acl from '../acl/';

import {
	AccessLayer,
	Query,
	AtomName,
	Atom,
	AtomShape,
	Depth,
	Molecule
} from '../types';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class BasicBLL<A extends AtomName> {
	
	protected _al:AccessLayer<A>;
	
	constructor(public atom_name:A, protected user_groups?:string[]){
		if(this.user_groups){
			this._al = urn_acl.create(this.atom_name, this.user_groups);
		}else{
			this._al = urn_dal.create(this.atom_name);
		}
	}
	
	public async find<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		return await this._al.select(query, options);
	}
	
	public async find_by_id<D extends Depth>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		return await this._al.select_by_id(id, depth);
	}
	
	public async find_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		return await this._al.select_one(query, options);
	}
	
	public async insert_new(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		return await this._al.insert_one(atom_shape);
	}
	
	public async update_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		return await this._al.alter_by_id(id, partial_atom);
	}
	
	public async update_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this.update_by_id(atom._id, atom as Partial<AtomShape<A>>);
	}
	
	public async remove_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._al.delete_by_id(id);
	}
	
	public async remove_one(molecule:Molecule<A>)
			:Promise<Atom<A>>{
		return await this.remove_by_id(molecule._id);
	}
	
}

export function create_basic<A extends AtomName>(atom_name:A):BasicBLL<A>{
	urn_log.fn_debug(`Create BasicBLL [${atom_name}]`);
	return new BasicBLL<A>(atom_name);
}



