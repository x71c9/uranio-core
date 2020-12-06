/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

// import {urn_log, urn_exception, urn_util} from 'urn-lib';
import {urn_log, urn_exception} from 'urn-lib';

import * as urn_atm from '../atm/';

import * as urn_rel from '../rel/';

import * as urn_validators from '../vali/';

import {QueryOptions, FilterType} from '../types';

import {core_config} from '../defaults';

import {atom_book} from '../book';

const urn_exc = urn_exception.init('DAL', 'Abstract DAL');

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class DAL<M> {
	
	protected _db_relation:urn_rel.Relation<M>;
	
	protected _db_trash_relation:urn_rel.Relation<M> | null;
	
	constructor(public atom_name:string) {
		
		switch(core_config.db_type){
			case 'mongo':{
				this._db_relation = new urn_rel.mongo.MongooseRelation<M>(
					this.atom_name,
					atom_book[this.atom_name].mongo_schema
				);
				this._db_trash_relation = new urn_rel.mongo.MongooseTrashRelation<M>(
					this.atom_name,
					atom_book[this.atom_name].mongo_schema
				);
				break;
			}
			default:{
				const err_msg = `The Database type in the configuration data is invalid.`;
				throw urn_exc.create('INVALID_DB_TYPE', err_msg);
				break;
			}
		}
	}
	
	public async select(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<urn_atm.AtomInstance[]>{
		return await this._select(filter, options);
	}
	
	public async select_by_id(id:string)
			:Promise<urn_atm.AtomInstance>{
		return await this._select_by_id(id);
	}
	
	public async select_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<urn_atm.AtomInstance>{
		return await this._select_one(filter, options);
	}
	
	public async insert_one(atom:urn_atm.AtomInstance)
			:Promise<urn_atm.AtomInstance>{
		await this._check_unique(atom);
		return await this._insert_one(atom);
	}
	
	public async alter_one(atom:urn_atm.AtomInstance)
			:Promise<urn_atm.AtomInstance>{
		await this._check_unique(atom);
		return await this._alter_one(atom);
	}
	
	public async delete_one(atom:urn_atm.AtomInstance)
			:Promise<urn_atm.AtomInstance>{
		const db_res_delete = await this._delete_one(atom);
		if(db_res_delete && this._db_trash_relation){
			db_res_delete._deleted_from = db_res_delete._id;
			return await this.trash_insert_one(db_res_delete);
		}
		return db_res_delete;
	}
	
	public async trash_select(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<urn_atm.AtomInstance[]>{
		return await this._select(filter, options, true);
	}
	
	public async trash_select_by_id(id:string)
			:Promise<urn_atm.AtomInstance>{
		return await this._select_by_id(id, true);
	}
	
	public async trash_select_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<urn_atm.AtomInstance>{
		return await this._select_one(filter, options, true);
	}
	
	public async trash_insert_one(atom:urn_atm.AtomInstance)
			:Promise<urn_atm.AtomInstance>{
		return await this._insert_one(atom, true);
	}
	
	public async trash_update_one(atom:urn_atm.AtomInstance)
			:Promise<urn_atm.AtomInstance>{
		return await this._alter_one(atom, true);
	}
	
	public async trash_delete_one(atom:urn_atm.AtomInstance)
			:Promise<urn_atm.AtomInstance>{
		return await this._delete_one(atom, true);
	}
	
	private async _select(filter:FilterType<M>, options?:QueryOptions<M>, in_trash = false)
			:Promise<urn_atm.AtomInstance[]>{
		if(in_trash === true && this._db_trash_relation === null){
			return [];
		}
		urn_validators.query.validate_filter_options_params(this.atom_name, filter, options);
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_select = await _relation.select(filter, options);
		const atom_array = db_res_select.reduce<urn_atm.AtomInstance[]>((result, db_record) => {
			result.push(urn_atm.create(this.atom_name, db_record));
			return result;
		}, []);
		return atom_array;
	}
	
	private async _select_by_id(id:string, in_trash = false)
			:Promise<urn_atm.AtomInstance>{
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
		return urn_atm.create(this.atom_name, db_res_select_by_id);
	}
	
	private async _select_one(filter:FilterType<M>, options?:QueryOptions<M>, in_trash = false)
			:Promise<urn_atm.AtomInstance>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _select_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('FIND_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		urn_validators.query.validate_filter_options_params(this.atom_name, filter, options);
		const db_res_select_one = await _relation.select_one(filter, options);
		return urn_atm.create(this.atom_name, db_res_select_one);
	}

	private async _insert_one(atom:urn_atm.AtomInstance, in_trash = false)
			:Promise<urn_atm.AtomInstance>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.insert_one(atom.return());
		return urn_atm.create(this.atom_name, db_res_insert);
	}
	
	private async _alter_one(atom:urn_atm.AtomInstance, in_trash = false)
			:Promise<urn_atm.AtomInstance>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _alter_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('UPD_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.alter_one(atom.return());
		return urn_atm.create(this.atom_name, db_res_insert);
	}
	
	private async _delete_one(atom:urn_atm.AtomInstance, in_trash = false)
			:Promise<urn_atm.AtomInstance>{
		if(in_trash === true && !this._db_trash_relation){
			const err_msg = `Cannot _delete_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('DEL_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.delete_one(atom.return());
		return urn_atm.create(this.atom_name, db_res_insert);
	}
	
	private async _check_unique(atom:urn_atm.AtomInstance)
			:Promise<void>{
		
		console.log(atom);
		
		// const filter:FilterType<M> = {};
		// filter.$or = [];
		// const model = atom.return();
		// for(const k of atom.get_keys().unique){
		//   const filter_object:{[P in keyof M]?:any} = {};
		//   filter_object[k] = model[k];
		//   filter.$or.push(filter_object);
		// }
		// try{
		//   const res_select_one = await this._select_one(filter);
		//   const equal_values:Set<keyof M> = new Set();
		//   const res_model = res_select_one.return();
		//   for(const k of atom.get_keys().unique){
		//     if(model[k] == res_model[k]){
		//       equal_values.add(k);
		//     }
		//   }
		//   let err_msg = `Atom unique fields are already in the database.`;
		//   err_msg += ` Duplicate fields: ${urn_util.formatter.json_one_line(equal_values)}.`;
		//   throw urn_exc.create('CHECK_UNIQUE_DUPLICATE', err_msg);
		// }catch(err){
		//   if(!err.type || err.type !== urn_exception.ExceptionType.NOT_FOUND){
		//     throw err;
		//   }
		// }
	}
	
	// private _create_atom(resource:M)
	//     :urn_atm.AtomInstance{
	//   return this.atom_definition.create(resource);
	// }
	
}

export type DalInstance = InstanceType<typeof DAL>;

export function create<M>(atom_name:string):DalInstance{
	urn_log.fn_debug(`Create DAL [${atom_name}]`);
	return new DAL<M>(atom_name);
}

