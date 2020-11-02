/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as urn_rsrc from '../rsrc/';

import * as urn_db from '../db/';

import {QueryOptions, QueryFilter} from './types';

const urn_con = urn_db.connection.create(
	'main',
	process.env.urn_db_host!,
	parseInt(process.env.urn_db_port!),
	process.env.urn_db_name!
);

@urn_log.decorators.debug_methods
export abstract class URNDAL<Resource extends urn_rsrc.ResourceInstance> {
	
	protected _db_relation:urn_db.Relation;
	
	constructor(public relation_name:string){
		
		this._db_relation = urn_con.get_relation(this.relation_name, this.get_schema());
		
	}
	
	protected abstract get_schema_definition():urn_db.SchemaDefinition;
	
	private get_schema()
			:urn_db.Schema{
		return new urn_db.Schema(this.get_schema_definition());
	}
	
	/**
	 * Private function that return a colleciton of records from a Relation
	 *
	 * @param filter - Filter object for query
	 *   e.g. {field0: 'value', field1: {$gt: 77}}
	 * @param projection [optional] - Optional fields to return
	 *   e.g. {field0: 1, field1: 0} or '+field0 -field1'
	 * @param options [optional] - Option object
	 *   e.g. {sort: 'field0', limit: 10, skip: 20}
	 * @param with_sensitve
	 *   if set to true will return sensitive fields
	 */
	private async _find(
		filter:QueryFilter<Resource>,
		projection?:QueryFilter<Resource> | string | null,
		options?:QueryOptions | null,
		with_sensitive:boolean
	):Promise<Resource[]>{
		
		return await this._db_relation.find();
	}
	
	public async find()
			:Promise<Resource[]>{
		return await this._find();
	}
	
	public async find_with_sensitive()
			:Promise<Resource[]>{
		return await this._find();
	}
	
	private async _find_by_id(){
		// TODO implement
	}
	
	public async find_by_id(){
		return await this._find_by_id();
	}
	
	public async find_by_id_with_sensitive(){
		return await this._find_by_id();
	}
	
	private async _find_one(){
		// TODO implement
	}
	
	public async find_one(){
		return await this._find_one();
	}
	
	public async find_one_with_sensitive(){
		return await this._find_one();
	}
	
	private async _insert_one(){
		// TODO implement
	}
	
	public async insert_one(){
		return await this._insert_one();
	}
	
	public async insert_one_with_sensitive(){
		return await this._insert_one();
	}
	
	private async _update_one(){
		// TODO implement
	}
	
	public async update_one(){
		return await this._update_one();
	}
	
	public async update_one_with_sensitive(){
		return await this._update_one();
	}
	
	private async _delete_one(){
		// TODO implement
	}
	
	public async delete_one(){
		return await this._delete_one();
	}
	
	public async delete_one_with_sensitive(){
		return await this._delete_one();
	}
	
	public async is_valid_id(){
		// TODO implement
	}

}

// export type DALInstance = InstanceType<typeof URNDAL>;

// export default function create_instance(name:string)
//     :DALInstance{
	
//   urn_log.fn_debug('create_instance for URNDAL');

//   return new URNDAL(name);
	
// }
