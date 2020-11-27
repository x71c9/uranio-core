/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import * as urn_atms from '../atm/';

import * as urn_rels from '../rel/';

import * as urn_validators from '../vali/';

import {DBType, QueryOptions, FilterType} from '../types';

const urn_exc = urn_exception.init('DAL', 'Abstract DAL');

@urn_log.decorators.debug_methods
export abstract class DAL<M extends urn_atms.models.Resource, A extends urn_atms.Atom<M>> {
	
	protected _db_relation:urn_rels.Relation<M>;
	
	protected _db_trash_relation:urn_rels.Relation<M> | null;
	
	constructor(public db_type:DBType, private _atom_module:urn_atms.AtomModule<M,A>) {
		switch(this.db_type){
			case 'mongo':
				this._db_relation = new urn_rels.mongo.MongooseRelation<M>(this._atom_module.relation_name);
				this._db_trash_relation = new urn_rels.mongo.MongooseTrashRelation<M>(this._atom_module.relation_name);
				break;
			default:
				this._db_relation = new urn_rels.mongo.MongooseRelation<M>(this._atom_module.relation_name);
				this._db_trash_relation = new urn_rels.mongo.MongooseTrashRelation<M>(this._atom_module.relation_name);
				break;
		}
	}
	
	public async find(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A[]>{
		return await this._find(filter, options);
	}
	
	public async find_by_id(id:string)
			:Promise<A>{
		return await this._find_by_id(id);
	}
	
	public async find_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A>{
		return await this._find_one(filter, options);
	}
	
	public async insert_one(atom:A)
			:Promise<A>{
		await this._check_unique(atom);
		return await this._insert_one(atom);
	}
	
	public async update_one(atom:A)
			:Promise<A>{
		await this._check_unique(atom);
		return await this._update_one(atom);
	}
	
	public async delete_one(atom:A)
			:Promise<A>{
		const db_res_delete = await this._delete_one(atom);
		if(db_res_delete && this._db_trash_relation){
			db_res_delete._deleted_from = db_res_delete._id;
			return await this.trash_insert_one(db_res_delete);
		}
		return db_res_delete;
	}
	
	public async trash_find(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A[]>{
		return await this._find(filter, options, true);
	}
	
	public async trash_find_by_id(id:string)
			:Promise<A>{
		return await this._find_by_id(id, true);
	}
	
	public async trash_find_one(filter:FilterType<M>, options?:QueryOptions<M>)
			:Promise<A>{
		return await this._find_one(filter, options, true);
	}
	
	public async trash_insert_one(atom:A)
			:Promise<A>{
		return await this._insert_one(atom, true);
	}
	
	public async trash_update_one(atom:A)
			:Promise<A>{
		return await this._update_one(atom, true);
	}
	
	public async trash_delete_one(atom:A)
			:Promise<A>{
		return await this._delete_one(atom, true);
	}
	
	private async _find(filter:FilterType<M>, options?:QueryOptions<M>, in_trash = false)
			:Promise<A[]>{
		if(in_trash === true && this._db_trash_relation === null){
			return [];
		}
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_find = await _relation.find(filter, options);
		const atom_array = db_res_find.reduce<A[]>((result, db_record) => {
			result.push(this._create_atom(db_record));
			return result;
		}, []);
		return atom_array;
	}
	
	private async _find_by_id(id:string, in_trash = false)
			:Promise<A>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _find_by_id [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('FIND_ID_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		if(!this._db_relation.is_valid_id(id)){
			throw urn_exc.create('FIND_ID_INVALID_ID', `Cannot _find_by_id. Invalid argument id.`);
		}
		const db_res_find_by_id = await _relation.find_by_id(id);
		return this._create_atom(db_res_find_by_id);
	}
	
	private async _find_one(filter:FilterType<M>, options?:QueryOptions<M>, in_trash = false)
			:Promise<A>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _find_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('FIND_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		const db_res_find_one = await _relation.find_one(filter, options);
		return this._create_atom(db_res_find_one);
	}

	private async _insert_one(atom:A, in_trash = false)
			:Promise<A>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.insert_one(atom.return());
		return this._create_atom(db_res_insert);
	}
	
	private async _update_one(atom:A, in_trash = false)
			:Promise<A>{
		if(in_trash === true && this._db_trash_relation === null){
			const err_msg = `Cannot _update_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('UPD_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.update_one(atom.return());
		return this._create_atom(db_res_insert);
	}
	
	private async _delete_one(atom:A, in_trash = false)
			:Promise<A>{
		if(in_trash === true && !this._db_trash_relation){
			const err_msg = `Cannot _delete_one [in_trash=true]. Trash DB not found.`;
			throw urn_exc.create('DEL_ONE_TRASH_NOT_FOUND', err_msg);
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.delete_one(atom.return());
		return this._create_atom(db_res_insert);
	}
	
	private async _check_unique(atom:A)
			:Promise<void>{
		const filter:FilterType<M> = {};
		filter.$or = [];
		const model = atom.return();
		for(const k of atom.get_keys().unique){
			const filter_object:{[P in keyof M]?:any} = {};
			filter_object[k] = model[k];
			filter.$or.push(filter_object);
		}
		try{
			const res_find_one = await this._find_one(filter);
			const equal_values:Set<keyof M> = new Set();
			const res_model = res_find_one.return();
			for(const k of atom.get_keys().unique){
				if(model[k] == res_model[k]){
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
	}
	
	private _create_atom(resource:M)
			:A{
		return this._atom_module.create(resource);
	}
	
}

