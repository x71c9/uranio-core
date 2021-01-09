/**
 * Class for Access Control Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ACL', 'Access Control Module');

import * as urn_dal from '../dal/';

import {atom_book} from '../book';

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
	
	// protected _write_query:Query<A>;
	
	constructor(public atom_name:A, protected user_groups:RealType<BookPropertyType.ID>[]) {
		this._dal = urn_dal.create(atom_name);
		const atom_def = atom_book[atom_name] as Book.Definition;
		const security = atom_def['security'];
		this._security_type = BookSecurityType.UNIFORM;
		this._read = undefined;
		this._write = undefined;
		if(security){
			if(typeof security === 'string'){
				this._security_type = security;
			}else{
				this._read = security._r;
				this._write = security._w;
			}
		}
		this._read_query = {$or: [{_r: {$exists: 0}}, {_r: {$in: user_groups}}]} as Query<A>;
		// this._write_query = {_w: {$in: user_groups}} as Query<A>;
	}
	
	protected _can_uniform_read()
			:void{
		if(this._security_type === BookSecurityType.UNIFORM){
			if(typeof this._read !== 'undefined' && !this.user_groups.includes(this._read)){
				throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Read unauthorized');
			}
		}
	}
	
	protected _can_uniform_write()
			:void{
		if(this._security_type === BookSecurityType.UNIFORM){
			if(typeof this._write === 'undefined' || !this.user_groups.includes(this._write)){
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
	
	public async select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		
		this._can_uniform_read();
		
		if(this._security_type === BookSecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			if(!options){
				options = {};
			}
			options.depth_query = query;
		}
		return await this._dal.select(query, options);
	}
	
	public async select_by_id<D extends Depth>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		
		this._can_uniform_read();
		
		const options = {depth: depth} as Query.Options<A,D>;
		let query = {_id: id} as Query<A>;
		if(this._security_type === BookSecurityType.GRANULAR){
			query = {$and: [query, this._read_query]};
			options.depth_query = query;
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
			options.depth_query = query;
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
		
		return await this._dal.delete_by_id(id);
	}
	
}

export function create<A extends AtomName>(atom_name:A, user_groups:RealType<BookPropertyType.ID>[])
		:ACL<A>{
	urn_log.fn_debug(`Create ACL [${atom_name}]`, user_groups);
	return new ACL<A>(atom_name, user_groups);
}



