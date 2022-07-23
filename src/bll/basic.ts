/**
 * Class for Basic Business Logic Layer
 *
 * It is a mirror of a Data Access Layer.
 * The method _get_access_layer can be overwritten when extending the class.
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {schema} from '../sch/server';

import * as urn_dal from '../dal/server';

import {AuthAction} from '../typ/auth';

import {AccessLayer} from '../typ/layer';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class BasicBLL<A extends schema.AtomName> {
	
	protected _al:AccessLayer<A>;
	
	constructor(public atom_name:A, init_access_layer?:() => AccessLayer<A>){
		if(!init_access_layer){
			this._al = urn_dal.create(atom_name);
		}else{
			this._al = init_access_layer();
		}
	}
	
	public is_valid_id(_id:string):boolean{
		return this._al.is_valid_id(_id);
	}
	
	public async find<D extends schema.Depth>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		return await this._al.select(query, options);
	}
	
	public async find_by_id<D extends schema.Depth>(id:string, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		return await this._al.select_by_id(id, options);
	}
	
	public async find_one<D extends schema.Depth>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		return await this._al.select_one(query, options);
	}
	
	public async count(query:schema.Query<A>)
			:Promise<number>{
		return await this._al.count(query);
	}
	
	public async insert_new(atom_shape:schema.AtomShape<A>)
			:Promise<schema.Atom<A>>{
		return await this._al.insert_one(atom_shape);
	}
	
	public async update_by_id<D extends schema.Depth>(id:string, partial_atom:Partial<schema.AtomShape<A>>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		return await this._al.alter_by_id(id, partial_atom, options);
	}
	
	public async update_one<D extends schema.Depth>(atom:schema.Atom<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		return await this.update_by_id(atom._id, atom as Partial<schema.AtomShape<A>>, options);
	}
	
	public async remove_by_id(id:string)
			:Promise<schema.Atom<A>>{
		return await this._al.delete_by_id(id);
	}
	
	public async remove_one<D extends schema.Depth>(molecule:schema.Molecule<A,D>)
			:Promise<schema.Atom<A>>{
		return await this.remove_by_id(molecule._id);
	}
	
	public async authorize(action:AuthAction, id?:string)
			:Promise<true>{
		return await this._al.authorize(action, id);
	}
	
	public async find_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		return await this._al.select({_id: {$in: ids}} as schema.Query<A>, options);
	}
	
	// public async find_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
	//     :Promise<schema.Molecule<A,D>[]>{
	//   return await this._al.select_multiple(ids, options);
	// }
	
	public async update_multiple(ids:string[], partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>[]>{
		return await this._al.alter_multiple(ids, partial_atom);
	}
	
	public async insert_multiple(atom_shapes:schema.AtomShape<A>[])
			:Promise<schema.Atom<A>[]>{
		return await this._al.insert_multiple(atom_shapes);
	}
	
	public async remove_multiple(ids:string[])
			:Promise<schema.Atom<A>[]>{
		return await this._al.delete_multiple(ids);
	}
	
	public async search<D extends schema.Depth>(string:string, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		return await this._al.search(string, options);
	}
	
	public async search_count(string:string)
			:Promise<number>{
		return await this._al.search_count(string);
	}
	
}

export function create<A extends schema.AtomName>(atom_name:A)
		:BasicBLL<A>{
	urn_log.fn_debug(`Create BasicBLL [${atom_name}]`);
	return new BasicBLL<A>(atom_name);
}



