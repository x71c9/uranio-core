/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import * as urn_atm from '../atm/';

import * as urn_rel from '../rel/';

import * as urn_validators from '../vali/';

import {
	Depth,
	Query,
	AtomName,
	AtomShape,
	Atom,
	Book,
	BookPropertyType,
	Molecule
} from '../types';

import {core_config} from '../config/defaults';

import {atom_book} from '../book';

import {atom_hard_properties, atom_common_properties} from '../typ/atom';

const urn_exc = urn_exception.init('DAL', 'Abstract DAL');

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class DAL<A extends AtomName> {
	
	protected _db_relation:urn_rel.Relation<A>;
	
	protected _db_trash_relation:urn_rel.Relation<A> | null;
	
	constructor(public atom_name:A) {
		switch(core_config.db_type){
			case 'mongo':{
				this._db_relation = urn_rel.mongo.create<A>(this.atom_name);
				this._db_trash_relation = urn_rel.mongo.trash_create<A>(this.atom_name);
				break;
			}
			default:{
				const err_msg = `The Database type in the configuration data is invalid.`;
				throw urn_exc.create('INVALID_DB_TYPE', err_msg);
				break;
			}
		}
	}
	
	protected async validate_molecule(molecule:Atom<A>):Promise<Atom<A>>;
	protected async validate_molecule(molecule:Atom<A>, depth?:0):Promise<Atom<A>>;
	protected async validate_molecule<D extends Depth>(molecule:Molecule<A,D>, depth?:D):Promise<Molecule<A,D>>
	protected async validate_molecule<D extends Depth>(molecule:Molecule<A,D> | Atom<A>, depth?:D)
			:Promise<Molecule<A,D> | Atom<A>>{
		return urn_atm.validate_molecule<A,D>(this.atom_name, molecule as Molecule<A,D>, depth);
	}
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A, D>)
			:Promise<Molecule<A, D>[]>{
		const atom_array = await this._select<D>(query, options);
		for(let i = 0; i < atom_array.length; i++){
			const depth = (options && options.depth) ? options.depth : undefined;
			atom_array[i] = await this.validate_molecule<D>(atom_array[i], depth);
		}
		return atom_array;
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		let db_record = await this._select_by_id(id, depth);
		db_record = await this.validate_molecule<D>(db_record, depth);
		return db_record;
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		let db_record = await this._select_one(query, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		db_record = await this.validate_molecule<D>(db_record, depth);
		return db_record;
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		atom_shape = await urn_atm.encrypt_properties<A>(this.atom_name, atom_shape);
		await this._check_unique(atom_shape as Partial<AtomShape<A>>);
		let db_record = await this._insert_one(atom_shape);
		db_record = await this.validate_molecule(db_record);
		return db_record;
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		await this._check_unique(partial_atom, id);
		let db_record = await this._alter_by_id(id, partial_atom);
		db_record = await this.validate_molecule(db_record);
		return db_record;
	}
	
	public async alter_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		let db_record = await this.alter_by_id(atom._id, atom as Partial<AtomShape<A>>);
		db_record = await this.validate_molecule(db_record);
		return db_record;
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		const db_res_delete = await this._delete_by_id(id);
		if(db_res_delete && this._db_trash_relation){
			db_res_delete._deleted_from = db_res_delete._id;
			return await this.trash_insert_one(db_res_delete);
		}
		const db_record = db_res_delete;
		return db_record;
	}
	
	public async delete_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		const db_record = await this.delete_by_id(atom._id);
		return db_record;
	}
	
	
	public async trash_select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		return await this._select(query, options, true);
	}
	
	public async trash_select_by_id<D extends Depth>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		return await this._select_by_id(id, depth, true);
	}
	
	public async trash_select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		return await this._select_one(query, options, true);
	}
	
	public async trash_insert_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this._insert_one(atom, true);
	}
	
	public async trash_delete_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this._delete_by_id(atom._id, true);
	}
	
	public async trash_delete_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._delete_by_id(id, true);
	}
	
	
	protected async _select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>, in_trash = false)
			:Promise<Molecule<A,D>[]>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _select [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('SELECT_IN_TRASH_NO_TRASH', err_msg);
		}
		urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_select = await _relation.select(query, options);
		const atom_array:Molecule<A,D>[] = [];
		for(const db_record of db_res_select){
			atom_array.push(db_record);
		}
		return atom_array;
	}
	
	protected async _select_by_id<D extends Depth>(id:string, depth?:D, in_trash = false)
			:Promise<Molecule<A,D>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _select_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('SELECT_ID_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		if(!this._db_relation.is_valid_id(id)){
			throw urn_exc.create('SELECT_ID_INVALID_ID', `Cannot _select_by_id. Invalid argument id.`);
		}
		const db_res_select_by_id = await _relation.select_by_id(id, depth);
		return db_res_select_by_id;
	}
	
	protected async _select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>, in_trash = false)
			:Promise<Molecule<A,D>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _select_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('SELECT_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		
		urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
		
		const db_res_select_one = await _relation.select_one(query, options);
		return db_res_select_one;
	}
	
	protected async _insert_one(atom_shape:AtomShape<A>, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.insert_one(atom_shape);
		return db_res_insert;
	}
	
	protected async _alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>, in_trash = false, fix = true)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _alter_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('ALTER_BY_ID_TRASH_NOT_FOUND', err_msg);
		}
		
		if(fix === true){
			partial_atom = await this._encrypt_changed_properties(id, partial_atom);
		}
		urn_atm.validate_atom_partial<A>(this.atom_name, partial_atom);
		
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.alter_by_id(id, partial_atom);
		return db_res_insert;
	}
	
	protected async _delete_by_id(id:string, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && !this._db_trash_relation){
			const err_msg = `Cannot _delete_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('DEL_BY_ID_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_delete = await _relation.delete_by_id(id);
		return db_res_delete;
	}
	
	protected async _encrypt_changed_properties(id:string, atom:Atom<A>)
			:Promise<Atom<A>>;
	protected async _encrypt_changed_properties(id:string, atom:Partial<AtomShape<A>>)
			:Promise<Partial<AtomShape<A>>>;
	protected async _encrypt_changed_properties(id:string, atom:Atom<A> | Partial<AtomShape<A>>)
			:Promise<Atom<A> | Partial<AtomShape<A>>>{
		const atom_props = atom_book[this.atom_name]['properties'];
		const all_props = {
			...atom_hard_properties,
			...atom_common_properties,
			...atom_props
		} as Book.Definition.Properties;
		for(const k in atom){
			const prop_def = all_props[k];
			if(prop_def && prop_def.type && prop_def.type === BookPropertyType.ENCRYPTED){
				let value = (atom as any)[k];
				if(value && typeof value === 'string' && (value.length !== 60 || value.startsWith('$2'))){
					value = await urn_atm.encrypt_property(this.atom_name, k as keyof Atom<A>, value);
				}else{
					const res_select = await this._select_by_id(id);
					const db_prop = (res_select as any)[k];
					if(db_prop && db_prop !== value){
						value = await urn_atm.encrypt_property(this.atom_name, k as keyof Atom<A>, value);
					}
				}
				(atom as any)[k] = value;
			}
		}
		return atom;
	}
	
	protected async _check_unique(partial_atom:Partial<AtomShape<A>>, id?:string)
			:Promise<true>{
		urn_atm.validate_atom_partial<A>(this.atom_name, partial_atom);
		const $or = [];
		for(const k of urn_atm.get_unique_keys(this.atom_name)){
			$or.push({[k]: partial_atom[k]});
		}
		if($or.length === 0){
			return true;
		}
		let query:Query<A> = {};
		if(typeof id === 'string' && this._db_relation.is_valid_id(id)){
			query = {$and: [{$not: {_id: id}}, {$or: $or}]} as Query<A>;
		}else{
			query = {$or: $or};
		}
		try{
			const res_select_one = await this._select_one<0>(query);
			const equal_values:Set<keyof Atom<A>> = new Set();
			for(const k of urn_atm.get_unique_keys<A>(this.atom_name)){
				if(partial_atom[k] === res_select_one[k]){
					equal_values.add(k);
				}
			}
			let err_msg = `Atom unique fields are already in the database.`;
			err_msg += ` Duplicate fields: ${urn_util.formatter.json_one_line(equal_values)}.`;
			throw urn_exc.create('CHECK_UNIQUE_DUPLICATE', err_msg);
		}catch(err){
			if(!err.type || err.type !== urn_exception.ExceptionType.NOT_FOUND){
				throw err;
			}
		}
		return true;
	}
	
}

// export type DalInstance = InstanceType<typeof DAL>;

export function create<A extends AtomName>(atom_name:A):DAL<A>{
	urn_log.fn_debug(`Create DAL [${atom_name}]`);
	return new DAL<A>(atom_name);
}

