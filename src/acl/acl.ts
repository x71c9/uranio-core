/**
 * Class for Access Control Layer
 *
 * The Access Control Layer is an Access Layer that will check if it is possible
 * to make the query and filters the results with only the accessible data.
 *
 * The permission on each Relation can be UNIFORM or GRANULAR.
 *
 * Default is UNIFORM.
 *
 * UNIFORM permission will check on a Relation level.
 * GRANULAR permission will check on a Record level.
 *
 * In order to the ACL to work, it needs User and Group Relations.
 * Each request is made by an User. Each User has Groups.
 *
 * Each Relation / Record has two attributes _r and _w, respectively for reading
 * and writing permission. The value of these attributes is a Group ID Array.
 *
 * _r will narrow from Everybody
 * _w will widen from Nobody
 *
 * _r == nullish -> Everybody can read
 * _w == nullish -> Nobody can write
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ACL', 'Access Control Module');

import {schema} from '../sch/server';

import * as urn_dal from '../dal/server';

import * as atm_keys from '../atm/keys';

import * as atm_util from '../atm/util';

import {SecurityType, PermissionType} from '../typ/book';

import {AuthAction} from '../typ/auth';

import {AccessLayer} from '../typ/layer';

import * as book from '../book/server';

import {search_query_object} from '../layer/index';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class ACL<A extends schema.AtomName> implements AccessLayer<A>{
	
	protected _dal:urn_dal.DAL<A>;
	
	protected _security_type:SecurityType;
	
	protected _read?: string;
	
	protected _write?: string;
	
	protected _read_query:schema.Query<A>;
	
	constructor(public atom_name:A, protected user_groups:string[]) {
		this._dal = urn_dal.create(atom_name);
		const atom_def = book.get_definition(atom_name);
		const security = atom_def['security'];
		this._security_type = SecurityType.UNIFORM;
		this._read = undefined;
		this._write = undefined;
		if(security){
			if(typeof security === 'string'){
				if(security === SecurityType.GRANULAR){
					this._security_type = security;
				}
			}else{
				this._read = security._r;
				this._write = security._w;
			}
		}
		this._read_query = {$or: [{_r: {$exists: 0}}, {_r: {$in: user_groups}}]} as schema.Query<A>;
	}
	
	protected _can_uniform_read()
			:void{
		if(this._security_type === SecurityType.UNIFORM){
			if(this._read === PermissionType.NOBODY || (this._read && !this.user_groups.includes(this._read))){
				throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Read unauthorized');
			}
		}
	}
	
	protected _can_uniform_write()
			:void{
		if(this._security_type === SecurityType.UNIFORM){
			if(this._write !==  PermissionType.PUBLIC && (!this._write || !this.user_groups.includes(this._write))){
				throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
			}
		}
	}
	
	protected async _can_atom_write(id:string)
			:Promise<boolean>{
		const atom = await this._dal.select_by_id(id);
		if(!atom._w || !this.user_groups.includes(atom._w)){
			throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
		}
		return true;
	}
	
	protected async _can_atom_write_multiple(ids:string[])
			:Promise<boolean>{
		const atoms = await this._dal.select({_id: {$in: ids}} as schema.Query<A>);
		for(const atom of atoms){
			if(!atom._w || !this.user_groups.includes(atom._w)){
				throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
			}
		}
		return true;
	}
	
	public filter_uniform_bond_properties<D extends schema.Depth>(molecule:schema.Molecule<A,D>, depth = 0)
			:schema.Molecule<A,D>{
		const bond_keys = atm_keys.get_bond<A,D>(this.atom_name);
		for(const k of bond_keys){
			const subatom_name = atm_util.get_subatom_name(this.atom_name, k as string);
			const acl = create(subatom_name, this.user_groups);
			try{
				acl._can_uniform_read();
				if(depth){
					const prop_value = molecule[k];
					if(Array.isArray(prop_value)){
						for(let subatom of prop_value){
							subatom = acl.filter_uniform_bond_properties(subatom, depth - 1);
						}
					}else{
						// molecule[k] = acl.filter_uniform_bond_properties(molecule[k] as schema.Molecule<A,D>, depth - 1) as any;
						molecule[k] = acl.filter_uniform_bond_properties(molecule[k] as any, depth - 1) as any;
					}
				}
			}catch(e){
				const err = e as any;
				if(err.type === urn_exception.ExceptionType.UNAUTHORIZED){
					// molecule[k] = (Array.isArray(molecule[k])) ? [] : '' as any;
					delete molecule[k];
				}else{
					throw err;
				}
			}
		}
		return molecule;
	}
	
	public async select<D extends schema.Depth>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		
		this._can_uniform_read();
		
		if(this._security_type === SecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			if(!options){
				options = {};
			}
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		const molecules = await this._dal.select(query, options);
		return molecules.map((m) => {
			const depth = (options) ? options.depth : 0;
			return this.filter_uniform_bond_properties(m, depth);
		});
	}
	
	public async select_by_id<D extends schema.Depth>(id:string, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		
		this._can_uniform_read();
		
		let query = {_id: id} as schema.Query<A>;
		if(options && this._security_type === SecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		return await this._dal.select_one(query, options);
	}
	
	public async select_one<D extends schema.Depth>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		
		this._can_uniform_read();
		
		if(this._security_type === SecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			if(!options){
				options = {};
			}
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		return await this._dal.select_one(query, options);
	}
	
	public async count(query:schema.Query<A>)
			:Promise<number>{
		
		this._can_uniform_read();
		
		if(this._security_type === SecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
		}
		return await this._dal.count(query);
	}
	
	public async insert_one(atom_shape:schema.AtomShape<A>)
			:Promise<schema.Atom<A>>{
		
		this._can_uniform_write();
		
		return await this._dal.insert_one(atom_shape);
	}
	
	public async alter_by_id<D extends schema.Depth>(
		id:string,
		partial_atom:Partial<schema.AtomShape<A>>,
		options?:schema.Query.Options<A,D>
	):Promise<schema.Molecule<A,D>>{
		
		this._can_uniform_write();
		
		if(this._security_type === SecurityType.GRANULAR){
			this._can_atom_write(id);
		}
		
		return await this._dal.alter_by_id(id, partial_atom, options);
	}
	
	public async delete_by_id(id:string)
			:Promise<schema.Atom<A>>{
		
		this._can_uniform_write();
		
		if(this._security_type === SecurityType.GRANULAR){
			this._can_atom_write(id);
		}
		
		const acl_res = await this._dal.delete_by_id(id);
		return acl_res;
	}
	
	public async authorize(action:AuthAction, id?:string)
			:Promise<true>{
		if(action === AuthAction.READ){
			this._can_uniform_read();
		}else if(action === AuthAction.WRITE){
			this._can_uniform_write();
			if(typeof id !== 'undefined' && this._security_type === SecurityType.GRANULAR){
				this._can_atom_write(id);
			}
		}
		return true;
	}
	
	public async select_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		
		this._can_uniform_read();
		
		let query = {_id: {$in: ids}} as schema.Query<A>;
		if(this._security_type === SecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			if(!options){
				options = {};
			}
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		const molecules = await this._dal.select(query, options);
		return molecules.map((m) => {
			const depth = (options) ? options.depth : 0;
			return this.filter_uniform_bond_properties(m, depth);
		});
	}
	
	public async alter_multiple(ids:string[], partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>[]>{
		
		this._can_uniform_write();
		
		if(this._security_type === SecurityType.GRANULAR){
			this._can_atom_write_multiple(ids);
		}
		
		return await this._dal.alter_multiple(ids, partial_atom);
	}
	
	public async insert_multiple(atom_shapes:schema.AtomShape<A>[])
			:Promise<schema.Atom<A>[]>{
		
		this._can_uniform_write();
		
		return await this._dal.insert_multiple(atom_shapes);
	}
	
	public async delete_multiple(ids:string[])
			:Promise<schema.Atom<A>[]>{
		
		this._can_uniform_write();
		
		if(this._security_type === SecurityType.GRANULAR){
			this._can_atom_write_multiple(ids);
		}
		
		const acl_res = await this._dal.delete_multiple(ids);
		return acl_res;
	}
	
	public async search<D extends schema.Depth>(string:string, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		
		this._can_uniform_read();
		
		let search_object = search_query_object(string, this.atom_name);
		if(this._security_type === SecurityType.GRANULAR){
			search_object = {$and: [this._read_query, search_object]};
			if(!options){
				options = {};
			}
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		return await this.select(search_object, options);
	}
	
	public async search_count(string:string)
			:Promise<number>{
		const search_object = search_query_object(string, this.atom_name);
		return await this.count(search_object);
	}
	
}

export function create<A extends schema.AtomName>(
	atom_name:A,
	user_groups:string[]
):ACL<A>{
	urn_log.fn_debug(`Create ACL [${atom_name}]`, user_groups);
	return new ACL<A>(atom_name, user_groups);
}



