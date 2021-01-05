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
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A, D>)
			:Promise<Molecule<A, D>[]>{
		const atom_array = await this._select<D>(query, options);
		for(let i = 0; i < atom_array.length; i++){
			const depth = (options && options.depth) ? options.depth : undefined;
			atom_array[i] = await this._fix_molecule_on_validation_error<D>(atom_array[i], depth);
		}
		return atom_array;
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		const db_record = await this._select_by_id(id, depth);
		return await this._fix_molecule_on_validation_error<D>(db_record, depth);
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		const db_record = await this._select_one(query, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		return await this._fix_molecule_on_validation_error<D>(db_record, depth);
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		
		atom_shape = await urn_atm.encrypt_properties<A>(this.atom_name, atom_shape);
		
		await this._check_unique(atom_shape as Partial<AtomShape<A>>);
		
		const db_record = await this._insert_one(atom_shape);
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		
		await this._check_unique(partial_atom, id);
		
		const db_record = await this._alter_by_id(id, partial_atom);
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async alter_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		const db_record = await this.alter_by_id(atom._id, atom as Partial<AtomShape<A>>);
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		const db_res_delete = await this._delete_by_id(id);
		
		// TODO TRASH IT
		
		// if(db_res_delete && this._db_trash_relation){
		//   db_res_delete._deleted_from = db_res_delete._id;
		//   return await this.trash_insert_one(db_res_delete);
		// }
		const db_record = db_res_delete;
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async delete_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		const db_record = await this.delete_by_id(atom._id);
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	// public async trash_select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
	//     :Promise<Molecule<A,D>[]>{
	//   return await this._select(query, options, true);
	// }
	
	// public async trash_select_by_id<D extends Depth>(id:string, depth?:D)
	//     :Promise<Molecule<A,D>>{
	//   return await this._select_by_id(id, depth, true);
	// }
	
	// public async trash_select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
	//     :Promise<Molecule<A,D>>{
	//   return await this._select_one(query, options, true);
	// }
	
	// public async trash_insert_one(atom:Atom<A>)
	//     :Promise<Atom<A>>{
	//   return await this._insert_one(atom, true);
	// }
	
	// public async trash_delete_one(atom:Atom<A>)
	//     :Promise<Atom<A>>{
	//   return await this._delete_by_id(atom._id, true);
	// }
	
	// public async trash_delete_by_id(id:string)
	//     :Promise<Atom<A>>{
	//   return await this._delete_by_id(id, true);
	// }
	
	private async _select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>, in_trash = false)
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
	
	private async _select_by_id<D extends Depth>(id:string, depth?:D, in_trash = false)
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
	
	private async _select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>, in_trash = false)
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
	
	private async _insert_one(atom_shape:AtomShape<A>, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
		}
		
		urn_atm.validate_atom_shape<A>(this.atom_name, atom_shape);
		
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.insert_one(atom_shape);
		return db_res_insert;
	}
	
	private async _alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>, in_trash = false, fix = true)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _alter_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('ALTER_BY_ID_TRASH_NOT_FOUND', err_msg);
		}
		if(fix === true){
			partial_atom = await this._encrypt_partial_atom_changed_properties(id, partial_atom);
		}
		urn_atm.validate_atom_partial<A>(this.atom_name, partial_atom);
		
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.alter_by_id(id, partial_atom);
		return db_res_insert;
	}
	
	private async _delete_by_id(id:string, in_trash = false)
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
	
	private async _replace_atom_on_error(id:string, atom:Atom<A>)
			:Promise<Atom<A>>{
			
		atom = await this._encrypt_atom_changed_properties(id, atom);

		urn_atm.validate_atom<A>(this.atom_name, atom);

		const db_res_insert = await this._db_relation.replace_by_id(id, atom);
		
		urn_atm.validate_atom<A>(this.atom_name, db_res_insert);
		return db_res_insert;
	}
	
	private async _replace_molecule_on_error<D extends Depth>(id:string, molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		const atom = urn_atm.molecule_to_atom(this.atom_name, molecule);
		await this._replace_atom_on_error(id, atom);
		return await this._select_by_id(id, depth);
	}
	
	private async _encrypt_atom_changed_properties(id:string, atom:Atom<A>)
			:Promise<Atom<A>>{
		const atom_props = atom_book[this.atom_name]['properties'] as Book.Definition.Properties;
		const all_props = {
			...atom_hard_properties,
			...atom_common_properties,
			...atom_props
		};
		for(const k in atom){
			if(
				urn_util.object.has_key(all_props, k) &&
				all_props[k].type &&
				(all_props[k].type as any) === BookPropertyType.ENCRYPTED
			){
				let value = atom[k];
				if(value && typeof value === 'string' && (value.length !== 60 || value.startsWith('$2'))){
					value = await urn_atm.encrypt_property(this.atom_name, k, value);
				}else{
					const res_select = await this._select_by_id(id);
					if(res_select[k] !== value){
						value = await urn_atm.encrypt_property(this.atom_name, k, value as string);
					}
				}
				(atom as any)[k] = value;
			}
		}
		return atom;
	}
	
	private async _encrypt_partial_atom_changed_properties(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Partial<AtomShape<A>>>{
		const atom_props = atom_book[this.atom_name]['properties'] as Book.Definition.Properties;
		const all_props = {
			...atom_common_properties,
			...atom_props
		};
		for(const k in partial_atom){
			if(
				urn_util.object.has_key(all_props, k) &&
				all_props[k].type &&
				(all_props[k].type as any) === BookPropertyType.ENCRYPTED
			){
				let value = partial_atom[k] as string;
				if(value && typeof value === 'string' && (value.length !== 60 || value.startsWith('$2'))){
					value = await urn_atm.encrypt_property(this.atom_name, k, value);
				}else{
					const res_select = await this._select_by_id(id);
					if(res_select[k] !== value){
						value = await urn_atm.encrypt_property(this.atom_name, k, value);
					}
				}
				partial_atom[k] = value as any;
			}
		}
		return partial_atom;
	}
	
	private async _check_unique(partial_atom:Partial<AtomShape<A>>, id?:string)
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
	
	private async _fix_molecule_on_validation_error<D extends Depth>(molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		if(!depth){
			
			return (await this._fix_atom_on_validation_error(molecule as Atom<A>)) as Molecule<A,D>;
			
		}else{
			const bond_keys = urn_atm.get_bond_keys(this.atom_name);
			for(const k of bond_keys){
				const bond_name = urn_atm.get_subatom_name(this.atom_name, k as string);
				let prop_value = molecule[k] as any;
				
				const SUBDAL = create(bond_name);
				
				if(Array.isArray(prop_value)){
					for(let i = 0; i < prop_value.length; i++){
						let subatom = prop_value[i];
						subatom =
							await SUBDAL._fix_molecule_on_validation_error(subatom, ((depth as number) - 1 as Depth));
					}
				}else{
					prop_value =
						await SUBDAL._fix_molecule_on_validation_error(prop_value, ((depth as number) - 1 as Depth));
				}
			}
		}
		try{
			
			urn_atm.validate_molecule_primitive_properties(this.atom_name, molecule);
			
		}catch(exc){
			if(exc.type !== urn_exception.ExceptionType.INVALID){
				throw exc;
			}
			if(this._db_trash_relation){
				const clone_molecule = {...molecule};
				clone_molecule._deleted_from = molecule._id;
				await this._db_trash_relation.insert_one(clone_molecule as AtomShape<A>);
			}
			let k:keyof Atom<A>;
			for(k of exc.keys){
				if(molecule[k] && !urn_atm.is_valid_property(this.atom_name, k)){
					delete molecule[k];
				}else{
					molecule = urn_atm.fix_molecule_property<A,D>(this.atom_name, molecule, k);
				}
			}
			molecule = await this._replace_molecule_on_error(molecule._id, molecule, depth);
		}
		return molecule;
	}
	
	private async _fix_atom_on_validation_error(atom:Atom<A>)
			:Promise<Atom<A>>{
		try{
			
			urn_atm.validate_atom<A>(this.atom_name, atom);
			
		}catch(exc){
			if(exc.type !== urn_exception.ExceptionType.INVALID){
				throw exc;
			}
			if(this._db_trash_relation){
				const clone_atom = {...atom};
				clone_atom._deleted_from = clone_atom._id;
				await this._db_trash_relation.insert_one(clone_atom);
			}
			let k:keyof Atom<A>;
			for(k of exc.keys){
				if(atom[k] && !urn_atm.is_valid_property(this.atom_name, k)){
					delete atom[k];
				}else{
					atom = urn_atm.fix_atom_property<A>(this.atom_name, atom, k);
				}
			}
			atom = await this._replace_atom_on_error(atom._id, atom);
		}
		return atom;
	}
	
}

// export type DalInstance = InstanceType<typeof DAL>;

export function create<A extends AtomName>(atom_name:A):DAL<A>{
	urn_log.fn_debug(`Create DAL [${atom_name}]`);
	return new DAL<A>(atom_name);
}

