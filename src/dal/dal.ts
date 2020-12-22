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
	QueryOptions,
	FilterType,
	AtomName,
	AtomShape,
	Atom,
	KeyOfAtom,
	// QueryLogical
} from '../types';

import {core_config} from '../config/defaults';

// import {AtomPropertiesDefinition, AtomPropertyType} from '../types';

// import {atom_book} from '../book';

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
	
	public async select(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Atom<A>[]>{
		return await this._select(filter, options);
	}
	
	public async select_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._select_by_id(id);
	}
	
	public async select_one(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Atom<A>>{
		return await this._select_one(filter, options);
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		
		await urn_atm.encrypt_properties<A>(this.atom_name, atom_shape);
		
		await this._check_unique(atom_shape);
		return await this._insert_one(atom_shape);
	}
	
	// public async alter_and_encrypt_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
	//     :Promise<Atom<A>>{
		
	//   await urn_atm.encrypt_properties<A>(this.atom_name, partial_atom);
		
	//   await this._check_unique(partial_atom, id);
	//   return await this._alter_by_id(id, partial_atom);
	// }
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		
		// await this._check_encrypted_properties(this.atom_name, id, partial_atom);
		// await urn_atm.encrypt_properties<A>(this.atom_name, partial_atom);
		
		await this._check_unique(partial_atom, id);
		return await this._alter_by_id(id, partial_atom);
	}
	
	// public async alter_and_encrypt_one(atom:Atom<A>)
	//     :Promise<Atom<A>>{
	//   return await this.alter_and_encrypt_by_id(atom._id, atom);
	// }
	
	public async alter_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this.alter_by_id(atom._id, atom);
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		const db_res_delete = await this._delete_by_id(id);
		if(db_res_delete && this._db_trash_relation){
			db_res_delete._deleted_from = db_res_delete._id;
			return await this.trash_insert_one(db_res_delete);
		}
		return db_res_delete;
	}
	
	public async delete_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this.delete_by_id(atom._id);
	}
	
	public async trash_select(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Atom<A>[]>{
		return await this._select(filter, options, true);
	}
	
	public async trash_select_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._select_by_id(id, true);
	}
	
	public async trash_select_one(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Atom<A>>{
		return await this._select_one(filter, options, true);
	}
	
	public async trash_insert_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this._insert_one(atom, true);
	}
	
	public async trash_alter_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this._alter_by_id(atom._id, atom, true);
	}
	
	public async trash_alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		return await this._alter_by_id(id, partial_atom, true);
	}
	
	public async trash_delete_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		return await this._delete_by_id(atom._id, true);
	}
	
	public async trash_delete_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._delete_by_id(id, true);
	}
	
	private async _select(filter:FilterType<A>, options?:QueryOptions<A>, in_trash = false)
			:Promise<Atom<A>[]>{
		if(in_trash === true && this._db_trash_relation === null){
			return [];
		}
		urn_validators.query.validate_filter_options_params(this.atom_name, filter, options);
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_select = await _relation.select(filter, options);
		const atom_array = db_res_select.reduce<Atom<A>[]>((result, db_record) => {
			
			urn_atm.validate<A>(this.atom_name, db_record);
			
			result.push(db_record);
			return result;
		}, []);
		return atom_array;
	}
	
	private async _select_by_id(id:string, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _select_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('FIND_ID_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		if(!this._db_relation.is_valid_id(id)){
			throw urn_exc.create('FIND_ID_INVALID_ID', `Cannot _select_by_id. Invalid argument id.`);
		}
		const db_res_select_by_id = await _relation.select_by_id(id);
		
		urn_atm.validate<A>(this.atom_name, db_res_select_by_id);
		
		return db_res_select_by_id;
	}
	
	private async _select_one(filter:FilterType<A>, options?:QueryOptions<A>, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _select_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('FIND_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		urn_validators.query.validate_filter_options_params(this.atom_name, filter, options);
		const db_res_select_one = await _relation.select_one(filter, options);
		
		urn_atm.validate<A>(this.atom_name, db_res_select_one);
		
		return db_res_select_one;
	}

	private async _insert_one(atom_shape:AtomShape<A>, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
		}
		
		urn_atm.validate_shape<A>(this.atom_name, atom_shape);
		
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.insert_one(atom_shape);
		
		urn_atm.validate<A>(this.atom_name, db_res_insert);
		
		return db_res_insert;
	}
	
	private async _alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>, in_trash = false)
			:Promise<Atom<A>>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _alter_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('ALTER_BY_ID_TRASH_NOT_FOUND', err_msg);
		}
		
		urn_atm.validate_partial<A>(this.atom_name, partial_atom);
		
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.alter_by_id(id, partial_atom);
		
		urn_atm.validate<A>(this.atom_name, db_res_insert);
		
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
		
		urn_atm.validate<A>(this.atom_name, db_res_delete);
		
		return db_res_delete;
	}
	
	// protected async _check_encrypted_properties(id:string, partial_atom:Partial<AtomShape<A>>)
	//     :Promise<true>{
	//   const encrypted_keys = urn_atm.get_encrypted_keys(this.atom_name);
	//   for(const k of encrypted_keys){
	//     if(urn_util.object.has_key(partial_atom, k)){
	//       if(partial_atom[k].length !== 60){
	//         partial_atom[k] = await urn_atm.encrypt_property(this.atom_name, k, partial_atom[k]);
	//       }
	//     }
	//   }
	//   return partial_atom;
	// }
	
	protected async _check_unique(partial_atom:Partial<AtomShape<A>>, id:false | string = false)
			:Promise<true>{
		
		urn_atm.validate_partial<A>(this.atom_name, partial_atom);
		
		const filter:FilterType<A> = {$and: [{$not: {_id: id}}]};
		if(id === false || !this._db_relation.is_valid_id(id)){
			delete filter.$and;
		}
		const $or = [];
		for(const k of urn_atm.get_unique_keys(this.atom_name)){
			$or.push({k: partial_atom[k]});
		}
		if($or.length === 0){
			return true;
		}
		if(filter.$and){
			filter.$and.push($or);
		}else{
			filter.$or = $or;
		}
		console.log(filter);
		try{
			const res_select_one = await this._select_one(filter);
			const equal_values:Set<KeyOfAtom<A>> = new Set();
			for(const k of urn_atm.get_unique_keys(this.atom_name)){
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

