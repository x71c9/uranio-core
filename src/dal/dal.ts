/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_error} from 'urn-lib';

import * as urn_atms from '../atms/';

import * as urn_rel from '../rel/';

import * as urn_validators from '../vali/';

import {DBType, QueryOptions, QueryFilter} from '../types';

@urn_log.decorators.debug_methods
export abstract class DAL<M extends urn_atms.models.Resource, A extends urn_atms.Atom<M>> {
	
	protected _db_relation:urn_rel.Relation<M>;
	
	constructor(
		public db_type:DBType,
		private _atom_module:urn_atms.AtomModule<M,A>,
	){
		switch(this.db_type){
			case 'mongo':
				this._db_relation = new urn_rel.mongo.MongooseRelation<M>(this._atom_module.relation_name);
				break;
			case 'mysql':
				break;
		}
		this._db_relation = new urn_rel.mongo.MongooseRelation<M>(this._atom_module.relation_name);
	}
	
	/**
	 * Method that returns a colleciton of records from a Relation
	 *
	 * @param filter - Filter object for query
	 *   e.g. {field0: 'value', field1: {$gt: 77}}
	 * @param options [optional] - Option object
	 *   e.g. {sort: 'field0', limit: 10, skip: 20}
	 */
	public async find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<A[]>{
		
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		
		const db_res_find = await this._db_relation.find(filter, options);
		const atom_array = db_res_find.reduce<A[]>((result, db_record) => {
			try{
				result.push(this._atom_module.create(db_record));
			}catch(err){
				let err_msg = `Dal.find(). Cannot create Atom.`;
				err_msg += ` Dal.relation_name [${this._atom_module.relation_name}].`;
				err_msg += ` Record _id [${db_record._id}]`;
				urn_log.error(err_msg);
			}
			return result;
		}, <A[]>[]);
		
		return atom_array;
		
	}
	
	/**
	 * Method that returns a record from a Relation matching a given `id`
	 *
	 * @param filter - Filter object for query
	 *   e.g. {field0: 'value', field1: {$gt: 77}}
	 * @param options [optional] - Option object
	 *   e.g. {sort: 'field0', limit: 10, skip: 20}
	 */
	public async find_by_id(id:string)
			:Promise<A | null>{
		if(!this._db_relation.is_valid_id(id)){
			throw urn_error.create(`Dal.find_by_id(). Invalid id.`);
		}
		const db_res_find_by_id = await this._db_relation.find_by_id(id);
		if(!db_res_find_by_id){
			return null;
		}
		try{
			const atom = this._atom_module.create(db_res_find_by_id);
			return atom;
		}catch(err){
			let err_msg = `Dal.find_by_id(). Cannot create Atom.`;
			err_msg += ` Dal.relation_name [${this._atom_module.relation_name}].`;
			err_msg += ` Record _id [${db_res_find_by_id._id}]`;
			throw urn_error.create(err_msg);
		}
	}
	
	/**
	 * Method that returns the first record from a Relation matching
	 * filter and options
	 *
	 * @param filter - Filter object for query
	 *   e.g. {field0: 'value', field1: {$gt: 77}}
	 * @param options [optional] - Option object
	 *   e.g. {sort: 'field0', limit: 10, skip: 20}
	 */
	public async find_one(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<A | null>{
		
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		
		const db_res_find_one = await this._db_relation.find_one(filter, options);
		try{
			return (!db_res_find_one) ? null : this._atom_module.create(db_res_find_one);
		}catch(err){
			let err_msg = `Dal.find(). Cannot create Atom.`;
			err_msg += ` Dal.relation_name [${this._atom_module.relation_name}].`;
			if(db_res_find_one && db_res_find_one._id)
				err_msg += ` Record _id [${db_res_find_one._id}]`;
			// err_msg += ` Record date [${db_record.date}]`;
			urn_log.error(err_msg);
			return null;
		}
	}
	
	/**
	 * Method that insert a record into a Relation
	 *
	 * @param atom - the Atom to insert
	 */
	public async insert_one(atom:A)
			:Promise<A | null>{
		const db_res_insert = await this._db_relation.insert_one(atom.return());
		if(!db_res_insert){
			return null;
		}
		try{
			return (!db_res_insert) ? null : this._atom_module.create(db_res_insert);
		}catch(err){
			let err_msg = `Dal.inser(). Cannot create Atom.`;
			err_msg += ` Dal.relation_name [${this._atom_module.relation_name}].`;
			if(db_res_insert && db_res_insert._id)
				err_msg += ` Record _id [${db_res_insert._id}]`;
			// err_msg += ` Record date [${db_record.date}]`;
			urn_log.error(err_msg);
			return null;
		}
	}
	
	/**
	 * Method that insert a record into a Relation
	 *
	 * @param atom - the Atom to update
	 */
	public async update_one(atom:A)
			:Promise<A | null>{
		const db_res_update = await this._db_relation.update_one(atom.return());
		if(!db_res_update)
			return null;
		try{
			return (!db_res_update) ? null : this._atom_module.create(db_res_update);
		}catch(err){
			let err_msg = `Dal.inser(). Cannot create Atom.`;
			err_msg += ` Dal.relation_name [${this._atom_module.relation_name}].`;
			if(db_res_update && db_res_update._id)
				err_msg += ` Record _id [${db_res_update._id}]`;
			// err_msg += ` Record date [${db_record.date}]`;
			urn_log.error(err_msg);
			return null;
		}
	}
	
	// public async delete_one()
	//     :Promise<R>{
	//   // TODO
	// }
	
}

