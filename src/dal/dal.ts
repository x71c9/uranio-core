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
	
	constructor(public db_type:DBType, private _atom_module:urn_atms.AtomModule<M,A>) {
		switch(this.db_type){
			case 'mongo':
				this._db_relation = new urn_rel.mongo.MongooseRelation<M>(this._atom_module.relation_name);
				break;
			case 'mysql':
				break;
		}
		// Because MySQL is not implemented yet
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
			:Promise<Array<A | null>>{
		
		urn_validators.query.validate_filter_options_params(this._atom_module.keys, filter, options);
		
		const db_res_find = await this._db_relation.find(filter, options);
		const atom_array = db_res_find.reduce<Array<A | null>>((result, db_record) => {
			result.push(this._create_atom(db_record, 'find'));
			return result;
		}, []);
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
			throw urn_error.create(`DAL.find_by_id(). Invalid id.`);
		}
		const db_res_find_by_id = await this._db_relation.find_by_id(id);
		return this._create_atom(db_res_find_by_id, 'find_by_id');
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
		return this._create_atom(db_res_find_one, 'find_one');
	}
	
	/**
	 * Method that insert a record into a Relation
	 *
	 * @param atom - the Atom to insert
	 */
	public async insert_one(atom:A)
			:Promise<A | null>{
		const db_res_insert = await this._db_relation.insert_one(atom.return());
		return this._create_atom(db_res_insert, 'insert_one');
	}
	
	/**
	 * Method that insert a record into a Relation
	 *
	 * @param atom - the Atom to update
	 */
	public async update_one(atom:A)
			:Promise<A | null>{
		const db_res_update = await this._db_relation.update_one(atom.return());
		return this._create_atom(db_res_update, 'update_one');
	}
	
	/**
	 * Method that delete a record from a Relation
	 *
	 * @param atom - the Atom to update
	 */
	public async delete_one(atom:A)
			:Promise<A | null>{
		const db_res_delete = await this._db_relation.delete_one(atom.return());
		return this._create_atom(db_res_delete, 'delete_one');
	}
	
	/**
	 * Private helper method for creating Atom and throwing Exception on Error
	 *
	 * @param resource - The resource from a Relation method
	 * @param func_name - DAL method name
	 */
	private _create_atom(resource:M | null, func_name:keyof DAL<M,A>)
			:A | null{
		try{
			return (!resource) ? null : this._atom_module.create(resource);
		}catch(err){
			let err_msg = `DAL.${func_name}(). Cannot create Atom.`;
			err_msg += ` DAL.relation_name [${this._atom_module.relation_name}].`;
			if(resource && resource._id)
				err_msg += ` Record _id [${resource._id}]`;
			urn_log.error(err_msg);
			return null;
		}
	}
	
}

