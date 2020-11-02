/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_util, urn_error} from 'urn-lib';

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
	public async find(
		filter:QueryFilter<Resource>,
		projection?:QueryFilter<Resource> | string | null,
		options?:QueryOptions<Resource>
	):Promise<Resource[]>{
		
		// validate filter projection options
		// -> this._relation.find()
		// loop and create Resource[] w/w/o sensitive
		
		const urn_res_valid_fil_pro_opt = this._validate_filter_projection_options_params(
			filter,
			projection,
			options
		);
		if(urn_res_valid_fil_pro_opt.error)
			return urn_res_valid_fil_pro_opt as urn_mid.IURNFail;
		return await urn_mid.async_res<ObjectType[]>(
			async () => {
				let mon_res_find = await this.relation.find(filter, projection, options);
				if(!mon_res_find)
					return mon_res_find;
				return mon_res_find.map((mongoose_document:any) => {
					return new this.OBJCLASS(mongoose_document).return(with_sensitive);
				})
			},'URNDAL.find'
		)();
		return await this._db_relation.find();
	}
	
	public async find_by_id()
			:Promise<Resource>{
		// TODO
	}
	
	public async find_one()
			:Promise<Resource>{
		// TODO
	}
	
	public async insert_one()
			:Promise<Resource>{
		// TODO
	}
	
	public async update_one()
			:Promise<Resource>{
		// TODO
	}
	
	public async delete_one()
			:Promise<Resource>{
		// TODO
	}
	
	private _validate_filter_projection_options_params(
		filter:QueryFilter<Resource>,
		projection?:QueryFilter<Resource> | string | null,
		options?:QueryOptions<Resource>
	):true | never{
	
	}

	private _validate_filter(filter:QueryFilter<Resource>)
			:true | never{
	
	}
	
	private _validate_projection_options(
		projection:QueryFilter<Resource>,
		options:QueryOptions<Resource>
	):true | never{
	
	}
	
	private _validate_projection(projection:QueryFilter<Resource>)
			:true | never{
	
	}
	
	/**
	 * Validate option object|string for querying Relation. Used in find, findOne, ...
	 *
	 * @param object - The object or the string to validate as option
	 *
	 */
	private _validate_options(options:QueryOptions<Resource>)
			:true | never{
		if(urn_util.object.has_key(options, 'sort')){
			switch(typeof options.sort){
				case 'string':{
					let sort_value = options.sort;
					if(options.sort[0] == '+' || options.sort[0] == '-'){
						sort_value = sort_value.substring(1, options.sort.length);
					}
					// if(sort_value != '_id' && !this.getApprovedFields().includes(sort_value)){
					if(!this.getApprovedFields().includes(sort_value)){
						throw urn_error.create(`Sort value not valid [${options.sort}]`);
					}
					break;
				}
				case 'object':{
					for(const k in options.sort){
						// if(k!='_id' && !this.getApprovedFields().includes(k))
						if(!this.getApprovedFields().includes(k)){
							throw urn_error.create(`Sort value not valid [${k}]`);
						}
						// if(!urn_util.object.has_key(options.sort, k)){
						//   throw urn_error.create('Invalid key');
						// }
						const sort_obj_value = options.sort[k];
						if(isNaN(sort_obj_value) || (sort_obj_value != -1 && sort_obj_value != 1)){
							throw urn_error.create('Sort value must be equal either to -1 or 1');
						}
					}
					break;
				}
			}
		}
		if(urn_util.object.has_key(options,'limit') && typeof options.limit != 'number'){
			throw urn_error.create('Limit value type must be number');
		}
		if(urn_util.object.has_key(options,'skip') && typeof options.skip != 'number'){
			throw urn_error.create('Skip value type must be number');
		}
		return true;
	}
}

// export type DALInstance = InstanceType<typeof URNDAL>;

// export default function create_instance(name:string)
//     :DALInstance{
	
//   urn_log.fn_debug('create_instance for URNDAL');

//   return new URNDAL(name);
	
// }

