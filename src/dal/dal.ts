/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_util, urn_error} from 'urn-lib';

import urn_mdls from 'urn-mdls';

import * as urn_rsrc from '../rsrc/';

import * as urn_db from '../db/';

import {QueryOptions, QueryFilter, FilterType} from './types';

const urn_con = urn_db.connection.create(
	'main',
	process.env.urn_db_host!,
	parseInt(process.env.urn_db_port!),
	process.env.urn_db_name!
);

@urn_log.decorators.debug_methods
export abstract class URNDAL<Resource extends urn_rsrc.ResourceInstance> {
	
	protected _db_relation:urn_db.Relation;
	
	protected _queryop:{andornor:string[], comparsion: string[]};
	
	constructor(public relation_name:string){
		
		this._db_relation = urn_con.get_relation(this.relation_name, this.get_schema());
		this._queryop = {
			andornor: ['$and','$or','$nor','$not'],
			comparsion: ['$eq','$gt','$gte','$in','$lt','$lte','$ne','$nin']
		};
		
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
		try{
			this._validate_filter_projection_options_params(filter, projection, options);
		}catch(err){
			throw urn_error.create(`Invalid query paramters`, err);
		}
		const mon_res_find = await this._db_relation.find(filter, projection, options);
	}
	
	// public async find_by_id()
	//     :Promise<Resource>{
	//   // TODO
	// }
	
	// public async find_one()
	//     :Promise<Resource>{
	//   // TODO
	// }
	
	// public async insert_one()
	//     :Promise<Resource>{
	//   // TODO
	// }
	
	// public async update_one()
	//     :Promise<Resource>{
	//   // TODO
	// }
	
	// public async delete_one()
	//     :Promise<Resource>{
	//   // TODO
	// }
	
	protected abstract _get_approved_fields():urn_mdls.ModelKeys<Resource>;
	
	private _validate_filter_projection_options_params(
		filter:QueryFilter<Resource>,
		projection?:QueryFilter<Resource> | string | null,
		options?:QueryOptions<Resource>
	):true | never{
		try{
			this._validate_filter(filter);
			if(projection){
				this._validate_projection(projection);
			}
			if(options){
				this._validate_options(options);
			}
		}catch(err){
			throw urn_error.create(`Invalid query paramters`, err);
		}
		return true;
	}

	/**
	 * Validate single field of a filter object
	 *
	 * @param field - The field to validate
	 *
	 */
	private _validate_field(field:any)
			:true | never{
		if(typeof field !== 'object' || field === null){
			throw urn_error.create('Invalid filter value format');
		}
		switch(typeof field){
			case 'string':
			case 'number':
				return true;
			case 'object':{
				for(const k in field){
					if(this._queryop.comparsion.indexOf(k) === -1){
						throw urn_error.create(`Filter value comparsion not valid [${k}]`);
					}
					if(typeof field[k] != 'string' && field[k] != 'number' && !Array.isArray(field[k])){
						throw urn_error.create(
							`Filter comparsion value type must be a string, a number, on an Array [${k}]`
						);
					}
					if(Array.isArray(field[k])){
						for(const v of field[k]){
							if(typeof v !== 'string' && typeof v !== 'number'){
								throw urn_error.create(`Invalid filter comparsion value type`);
							}
						}
					}
				}
				return true;
			}
			default:
				throw urn_error.create('Filter filed type not valid');
		}
	}

	/**
	 * Validate filter object for querying Relation. used in find, find_one, ...
	 *
	 * filter must be in format:
	 * - {key: value} where key is key of Resource
	 * - {$and|$or|$nor: [{key: value},{key: value}, ...]}
	 * - {$and|$or|$nor: [{$and|$or|$nor: [...], ...]}
	 *
	 * @param filter - The filter to validate
	 */
	private _validate_filter(filter:FilterType<Resource>)
			:true | never{
		if(typeof filter !== 'object' || filter === null){
			throw urn_error.create(`Invalid filter format`);
		}
		let key:keyof FilterType<Resource>;
		for(key in filter){
			if(this._queryop.andornor.indexOf(key) !== -1){
				if(!Array.isArray(filter[key])){
					throw urn_error.create(
						`Invalid filter format. Filter value for [${key}] must be an array`
					);
				}
				for(let i=0; i < filter[key].length; i++){
					this._validate_filter(filter[key][i]);
				}
			}else{
				// if(key!='_id' && !this._get_approved_fields().includes(key))
				if(!urn_util.object.has_key(this._get_approved_fields(), key)){
					throw urn_error.create(`Filter field not valid [${key}]`);
				}
				try{
					this._validate_field(filter[key]);
				}catch(err){
					throw urn_error.create(`Invalid filter value`, err);
				}
			}
		}
		return true;
	}
	
	/**
	 * Validate projection object for querying Relation. used in find, find_one, ...
	 *
	 * @param projection - The projection to validate
	 *
	 */
	private _validate_projection(projection:QueryFilter<Resource> | string)
			:true | never{
		switch(typeof projection){
			case 'string':{
				if(urn_util.object.has_key(this._get_approved_fields(), projection)){
					return true;
				}
				const splitted = projection.split(' ');
				const first_chars = splitted.map(v => v[0]);
				if(first_chars.indexOf('-') !== -1 && !first_chars.every(v => v === first_chars[0])){
					throw urn_error.create('Projection cannot have a mix of including and excluding');
				}
				for(let i=0; i < splitted.length; i++){
					const s = splitted[i];
					if(s[0] == '-' || s[0] == '+'){
						const substring = s.substring(1, s.length);
						if(!urn_util.object.has_key(this._get_approved_fields(), substring))
							throw urn_error.create(`Projection invalid [${s}]`);
					}else{
						if(!urn_util.object.has_key(this._get_approved_fields(), s))
							throw urn_error.create(`Projection invalid [${s}]`);
					}
				}
				return true;
			}
			case 'object':{
				for(const k in projection){
					if(!urn_util.object.has_key(this._get_approved_fields(), k)){
						throw urn_error.create(`Projection invalid [${k}]`);
					}
					if(projection[k] != 1 && projection[k] != 0){
						throw urn_error.create(`Projection invalid [${k}]`);
					}
				}
				return true;
			}
			default:{
				throw urn_error.create('Projection has an invalid type');
			}
		}
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
					// if(sort_value != '_id' && !this._get_approved_fields().includes(sort_value)){
					if(!urn_util.object.has_key(this._get_approved_fields(), sort_value)){
						throw urn_error.create(`Sort value not valid [${options.sort}]`);
					}
					break;
				}
				case 'object':{
					for(const k in options.sort){
						// if(k!='_id' && !this._get_approved_fields().includes(k))
						if(!urn_util.object.has_key(this._get_approved_fields(), k)){
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

