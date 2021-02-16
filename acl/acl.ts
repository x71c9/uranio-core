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

import {atom_book} from 'urn_book';

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ACL', 'Access Control Module');

import * as urn_dal from '../dal/';

import * as atm_keys from '../atm/keys';

import * as atm_util from '../atm/util';

import {
	Query,
	AtomName,
	Atom,
	AtomShape,
	Depth,
	Molecule,
	Book,
	BookPropertyType,
	BookSecurityType,
	BookPermissionType,
	RealType,
	AccessLayer
} from '../types';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class ACL<A extends AtomName> implements AccessLayer<A>{
	
	protected _dal:urn_dal.DAL<A>;
	
	protected _security_type:BookSecurityType;
	
	protected _read?:RealType<BookPropertyType.ID>;
	
	protected _write?:RealType<BookPropertyType.ID>;
	
	protected _read_query:Query<A>;
	
	constructor(public atom_name:A, protected user_groups:RealType<BookPropertyType.ID>[]) {
		this._dal = urn_dal.create(atom_name);
		const atom_def = atom_book[atom_name] as Book.Definition;
		const security = atom_def['security'];
		this._security_type = BookSecurityType.UNIFORM;
		this._read = undefined;
		this._write = undefined;
		if(security){
			if(typeof security === 'string'){
				if(security === BookSecurityType.GRANULAR){
					this._security_type = security;
				}
			}else{
				this._read = security._r;
				this._write = security._w;
			}
		}
		this._read_query = {$or: [{_r: {$exists: 0}}, {_r: {$in: user_groups}}]} as Query<A>;
	}
	
	protected _can_uniform_read()
			:void{
		if(this._security_type === BookSecurityType.UNIFORM){
			if(this._read === BookPermissionType.NOBODY || (this._read && !this.user_groups.includes(this._read))){
				throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Read unauthorized');
			}
		}
	}
	
	protected _can_uniform_write()
			:void{
		if(this._security_type === BookSecurityType.UNIFORM){
			if(this._write !==  BookPermissionType.PUBLIC && (!this._write || !this.user_groups.includes(this._write))){
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
	
	public filter_uniform_bond_properties<D extends Depth>(molecule:Molecule<A,D>, depth = 0)
			:Molecule<A,D>{
		const bond_keys = atm_keys.get_bond(this.atom_name);
		let k:keyof Molecule<A,D>;
		for(k of bond_keys){
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
						molecule[k] = acl.filter_uniform_bond_properties(molecule[k] as Molecule<A,D>, depth - 1) as any;
					}
				}
			}catch(err){
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
	
	public async select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		
		this._can_uniform_read();
		
		if(this._security_type === BookSecurityType.GRANULAR){
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
	
	public async select_by_id<D extends Depth>(id:string, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		
		this._can_uniform_read();
		
		let query = {_id: id} as Query<A>;
		if(options && this._security_type === BookSecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		return await this._dal.select_one(query, options);
	}
	
	public async select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		
		this._can_uniform_read();
		
		if(this._security_type === BookSecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			if(!options){
				options = {};
			}
			// options.depth_query = query;
			options.depth_query = this._read_query;
		}
		return await this._dal.select_one(query, options);
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		
		this._can_uniform_write();
		
		return await this._dal.insert_one(atom_shape);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		
		this._can_uniform_write();
		
		if(this._security_type === BookSecurityType.GRANULAR){
			this._can_atom_write(id);
		}
		
		return await this._dal.alter_by_id(id, partial_atom);
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		
		this._can_uniform_write();
		
		if(this._security_type === BookSecurityType.GRANULAR){
			this._can_atom_write(id);
		}
		
		const acl_res = await this._dal.delete_by_id(id);
		return acl_res;
	}
	
}

export function create<A extends AtomName>(atom_name:A, user_groups:RealType<BookPropertyType.ID>[])
		:ACL<A>{
	urn_log.fn_debug(`Create ACL [${atom_name}]`, user_groups);
	return new ACL<A>(atom_name, user_groups);
}



