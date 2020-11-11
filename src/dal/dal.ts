/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_util, urn_error} from 'urn-lib';

import urn_mdls from 'urn-mdls';

import * as urn_atom from '../atom/';

import * as urn_rel from '../rel/';

import {RelationName, DBType, QueryOptions, QueryFilter, FilterType} from '../types';

const _queryop = {
	andornor: ['$and','$or','$nor','$not'],
	comparsion: ['$eq','$gt','$gte','$in','$lt','$lte','$ne','$nin']
};

@urn_log.decorators.debug_methods
export abstract class DAL<M extends urn_mdls.resources.Resource, A extends urn_atom.Atom<M>> {
	
	protected _db_relation:urn_rel.Relation<M>;
	
	constructor(private _db_type:DBType, public relation_name:RelationName, private _atom_module:urn_atom.AtomModule<M,A>){
		switch(this._db_type){
			case 'mongo':
				this._db_relation = new urn_rel.mongo.MongooseRelation<M>(relation_name);
				break;
			case 'mysql':
				break;
		}
		
		this._db_relation = new urn_rel.mongo.MongooseRelation<M>(relation_name);
		
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
		
		_validate_filter_options_params(this._atom_module, filter, options);
		
		const db_res_find = await this._db_relation.find(filter, options);
		const atom_array = db_res_find.reduce<A[]>((result, db_record) => {
			try{
				result.push(this._atom_module.create(db_record));
			}catch(err){
				let err_msg = `Dal.find(). Cannot create Atom.`;
				err_msg += ` Dal.relation_name [${this.relation_name}].`;
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
			err_msg += ` Dal.relation_name [${this.relation_name}].`;
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
		
		_validate_filter_options_params(this._atom_module, filter, options);
		
		const db_res_find_one = await this._db_relation.find_one(filter, options);
		try{
			return (db_res_find_one === null) ? null : this._atom_module.create(db_res_find_one);
		}catch(err){
			let err_msg = `Dal.find(). Cannot create Atom.`;
			err_msg += ` Dal.relation_name [${this.relation_name}].`;
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
			:Promise<A>{
		const db_res_insert = await this._db_relation.insert_one(atom.return());
		return this._atom_module.create(db_res_insert);
	}
	
	/**
	 * Method that insert a record into a Relation
	 *
	 * @param atom - the Atom to update
	 */
	public async update_one(atom:A)
			:Promise<A | null>{
		const db_res_insert = await this._db_relation.update_one(atom.return());
		if(db_res_insert === null)
			return null;
		return this._atom_module.create(db_res_insert);
	}
	
	// public async delete_one()
	//     :Promise<R>{
	//   // TODO
	// }
	
}

/**
 * Helper functions
 */

/**
 * Validate id
 */
// function _is_valid_id(id:string)
//     :boolean{
//   return urn_con.is_valid_id(id);
// }

/**
 * Validate `filter` and `options` paramaters
 *
 * @param atom_module - The Atom module that is needed to check the keys
 * @param filter - the filter object
 * @param options- the options object
 */
function _validate_filter_options_params<M extends urn_mdls.resources.Resource, A extends urn_atom.Atom<M>>(
	atom_module:urn_atom.AtomModule<M, A>,
	filter:QueryFilter<M>,
	options?:QueryOptions<M>,
):true{
	try{
		_validate_filter<M,A>(filter, atom_module);
		if(options){
			_validate_options(options, atom_module);
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
function _validate_field(field:any)
		:true{
	if(field === null){
		throw urn_error.create('Invalid filter value format');
	}
	switch(typeof field){
		case 'string':
		case 'number':
			return true;
		case 'object':{
			for(const k in field){
				if(_queryop.comparsion.indexOf(k) === -1){
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
 * - {key: value} where key is key of R
 * - {$and|$or|$nor: [{key: value},{key: value}, ...]}
 * - {$and|$or|$nor: [{$and|$or|$nor: [...], ...]}
 *
 * @param filter - The filter to validate
 */
function _validate_filter<M extends urn_mdls.resources.Resource, A extends urn_atom.Atom<M>>
(filter:FilterType<M>, atom_module:urn_atom.AtomModule<M,A>)
		:true{
	if(typeof filter !== 'object' || filter === null){
		throw urn_error.create(`Invalid filter format`);
	}
	let key:keyof FilterType<M>;
	for(key in filter){
		if(_queryop.andornor.indexOf(key) !== -1){
			if(!Array.isArray(filter[key])){
				throw urn_error.create(
					`Invalid filter format. Filter value for [${key}] must be an array`
				);
			}
			for(let i=0; i < filter[key].length; i++){
				_validate_filter(filter[key][i], atom_module);
			}
		}else{
			if(!atom_module.keys.approved.has(key)){
				throw urn_error.create(`Filter field not valid [${key}]`);
			}
			try{
				_validate_field(filter[key]);
			}catch(err){
				throw urn_error.create(`Invalid filter value`, err);
			}
		}
	}
	return true;
}

/**
 * Validate option object|string for querying Relation. Used in find, findOne, ...
 *
 * @param object - The object or the string to validate as option
 *
 */
function _validate_options<M extends urn_mdls.resources.Resource, A extends urn_atom.Atom<M>>
(options:QueryOptions<M>, atom_module:urn_atom.AtomModule<M,A>)
		:true{
	if(urn_util.object.has_key(options, 'sort')){
		switch(typeof options.sort){
			case 'string':{
				let sort_value = options.sort;
				if(options.sort[0] == '+' || options.sort[0] == '-'){
					sort_value = sort_value.substring(1, options.sort.length);
				}
				if(!atom_module.keys.approved.has(sort_value as keyof M)){
					throw urn_error.create(`Sort value not valid [${options.sort}]`);
				}
				break;
			}
			case 'object':{
				for(const k in options.sort){
					if(!atom_module.keys.approved.has(k)){
						throw urn_error.create(`Sort value not valid [${k}]`);
					}
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

/**
 * Validate projection object for querying Relation. used in find, find_one, ...
 *
 * @param projection - The projection to validate
 *
 */
// _validate_projection(projection:QueryFilter<R> | string)
//     :true | never{
//   switch(typeof projection){
//     case 'string':{
//       if(urn_util.object.has_key(this._approved_keys, projection)){
//         return true;
//       }
//       const splitted = projection.split(' ');
//       const first_chars = splitted.map(v => v[0]);
//       if(first_chars.indexOf('-') !== -1 && !first_chars.every(v => v === first_chars[0])){
//         throw urn_error.create('Projection cannot have a mix of including and excluding');
//       }
//       for(let i=0; i < splitted.length; i++){
//         const s = splitted[i];
//         if(s[0] == '-' || s[0] == '+'){
//           const substring = s.substring(1, s.length);
//           if(!urn_util.object.has_key(this._approved_keys, substring))
//             throw urn_error.create(`Projection invalid [${s}]`);
//         }else{
//           if(!urn_util.object.has_key(this._approved_keys, s))
//             throw urn_error.create(`Projection invalid [${s}]`);
//         }
//       }
//       return true;
//     }
//     case 'object':{
//       for(const k in projection){
//         if(!urn_util.object.has_key(this._approved_keys, k)){
//           throw urn_error.create(`Projection invalid [${k}]`);
//         }
//         if(projection[k] != 1 && projection[k] != 0){
//           throw urn_error.create(`Projection invalid [${k}]`);
//         }
//       }
//       return true;
//     }
//     default:{
//       throw urn_error.create('Projection has an invalid type');
//     }
//   }
// }
