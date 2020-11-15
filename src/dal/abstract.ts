/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_error, urn_util} from 'urn-lib';

import * as urn_atm from '../atm/';

import * as urn_rel from '../rel/';

import * as urn_validators from '../vali/';

import {DBType, QueryOptions, QueryFilter} from '../types';

@urn_log.decorators.debug_methods
export abstract class DAL<M extends urn_atm.models.Resource, A extends urn_atm.Atom<M>> {
	
	protected _db_relation:urn_rel.Relation<M>;
	
	protected _db_trash_relation:urn_rel.Relation<M> | null;
	
	constructor(public db_type:DBType, private _atom_module:urn_atm.AtomModule<M,A>) {
		switch(this.db_type){
			case 'mongo':
				this._db_relation = new urn_rel.mongo.MongooseRelation<M>(this._atom_module.relation_name);
				this._db_trash_relation = new urn_rel.mongo.MongooseTrashRelation<M>(this._atom_module.relation_name);
				break;
			default:
				this._db_relation = new urn_rel.mongo.MongooseRelation<M>(this._atom_module.relation_name);
				this._db_trash_relation = new urn_rel.mongo.MongooseTrashRelation<M>(this._atom_module.relation_name);
				break;
		}
	}
	
	public async find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<Array<A | null>>{
		return await this._find(filter, options);
	}
	
	public async find_by_id(id:string)
			:Promise<A | null>{
		return await this._find_by_id(id);
	}
	
	public async find_one(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<A | null>{
		return await this._find_one(filter, options);
	}
	
	public async insert_one(atom:A)
			:Promise<A | null>{
		await this._check_unique(atom, 'insert_one');
		return await this._insert_one(atom);
	}
	
	public async update_one(atom:A)
			:Promise<A | null>{
		await this._check_unique(atom, 'update_one');
		return await this._update_one(atom);
	}
	
	public async delete_one(atom:A)
			:Promise<A | null>{
		const db_res_delete = await this._delete_one(atom);
		if(db_res_delete && this._db_trash_relation){
			db_res_delete._deleted_from = db_res_delete._id;
			return await this.trash_insert_one(db_res_delete);
		}
		return db_res_delete;
	}
	
	public async trash_find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<Array<A | null>>{
		return await this._find(filter, options, true);
	}
	
	public async trash_find_by_id(id:string)
			:Promise<A | null>{
		return await this._find_by_id(id, true);
	}
	
	public async trash_find_one(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<A | null>{
		return await this._find_one(filter, options, true);
	}
	
	public async trash_insert_one(atom:A)
			:Promise<A | null>{
		return await this._insert_one(atom, true);
	}
	
	public async trash_update_one(atom:A)
			:Promise<A | null>{
		return await this._update_one(atom, true);
	}
	
	public async trash_delete_one(atom:A)
			:Promise<A | null>{
		return await this._delete_one(atom, true);
	}
	
	private async _find(filter:QueryFilter<M>, options?:QueryOptions<M>, in_trash = false)
			:Promise<Array<A | null>>{
		if(in_trash === true && this._db_trash_relation === null){
			return [];
		}
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_find = await _relation.find(filter, options);
		const atom_array = db_res_find.reduce<Array<A | null>>((result, db_record) => {
			const func_name = '_find' + (in_trash === true) ? ' [TRASH]' : '';
			result.push(this._create_atom(db_record, func_name));
			return result;
		}, []);
		return atom_array;
	}
	
	private async _find_by_id(id:string, in_trash = false)
			:Promise<A | null>{
		if(in_trash === true && this._db_trash_relation === null){
			return null;
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		if(!this._db_relation.is_valid_id(id)){
			throw urn_error.create(`DAL.find_by_id(). Invalid id.`);
		}
		const db_res_find_by_id = await _relation.find_by_id(id);
		const func_name = '_find_by_id' + (in_trash === true) ? ' [TRASH]' : '';
		return this._create_atom(db_res_find_by_id, func_name);
	}
	
	private async _find_one(filter:QueryFilter<M>, options?:QueryOptions<M>, in_trash = false)
			:Promise<A | null>{
		if(in_trash === true && this._db_trash_relation === null){
			return null;
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		const db_res_find_one = await _relation.find_one(filter, options);
		const func_name = '_find_one' + (in_trash === true) ? ' [TRASH]' : '';
		return this._create_atom(db_res_find_one, func_name);
	}

	private async _insert_one(atom:A, in_trash = false)
			:Promise<A | null>{
		if(in_trash === true && this._db_trash_relation === null){
			return null;
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.insert_one(atom.return());
		const func_name = '_insert_one' + (in_trash === true) ? ' [TRASH]' : '';
		return this._create_atom(db_res_insert, func_name);
	}
	
	private async _update_one(atom:A, in_trash = false)
			:Promise<A | null>{
		if(in_trash === true && this._db_trash_relation === null){
			return null;
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.update_one(atom.return());
		const func_name = '_update_one' + (in_trash === true) ? ' [TRASH]' : '';
		return this._create_atom(db_res_insert, func_name);
	}
	
	private async _delete_one(atom:A, in_trash = false)
			:Promise<A | null>{
		if(in_trash === true && !this._db_trash_relation){
			return null;
		}
		const _relation = (in_trash === true && this._db_trash_relation) ?
			this._db_trash_relation : this._db_relation;
		const db_res_insert = await _relation.delete_one(atom.return());
		const func_name = '_delete_one' + (in_trash === true) ? ' [TRASH]' : '';
		return this._create_atom(db_res_insert, func_name);
	}
	
	private async _check_unique(atom:A, func_name:string)
			:Promise<void>{
		const filter:QueryFilter<M> = {};
		const model = atom.return();
		for(const k of atom.get_keys().unique){
			filter[k] = model[k];
		}
		const res_find_one = await this._find_one(filter);
		if(res_find_one !== null){
			let err_msg = `Cannot ${func_name}.`;
			err_msg += ` Atom unique fields are already in the database.`;
			err_msg += ' ' +  urn_util.formatter.json_one_line(filter);
			throw urn_error.create(err_msg);
		}
	}
	
	private _create_atom(resource:M | null, func_name:string)
			:A | null{
		try{
			return (!resource) ? null : this._atom_module.create(resource);
		}catch(err){
			let err_msg = `DAL.${func_name}. Cannot create Atom.`;
			err_msg += ` DAL.relation_name [${this._atom_module.relation_name}].`;
			if(resource && resource._id)
				err_msg += ` Record _id [${resource._id}]`;
			urn_log.error(err_msg);
			return null;
		}
	}
	
}

