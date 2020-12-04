/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

import {QueryOptions, FilterType, AtomProperties} from '../types';

import * as urn_atms from '../atm/';

const _queryop = {
	andornor: {
		$and: null,
		$or: null,
		$nor: null,
		$not: null
	},
	comparsion: {
		$eq: null,
		$gt: null,
		$gte: null,
		$in: null,
		$lt: null,
		$lte: null,
		$ne: null,
		$nin: null
	}
};

const urn_exc = urn_exception.init('QUERY_VALIDATE','Query Validator');

/**
 * Validate `filter` and `options` paramaters
 *
 * @param atom_properties - The Atom module that is needed to check the keys
 * @param filter - the filter object
 * @param options- the options object
 */
export function validate_filter_options_params<M extends urn_atms.models.Resource>
(atom_properties:AtomProperties, filter:FilterType<M>, options?:QueryOptions<M>)
		:true{
	validate_filter<M>(filter, atom_properties);
	if(options){
		validate_options(options, atom_properties);
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
		const err_msg = `Cannot _validate_field. Invalid argument "field". "field" is null.`;
		throw urn_exc.create('FIELD_NULL', err_msg);
	}
	switch(typeof field){
		case 'string':
		case 'number':
			return true;
		case 'object':{
			for(const k in field){
				// if(_queryop.comparsion.indexOf(k) === -1){
				if(urn_util.object.has_key(_queryop.comparsion, k)){
					const err_msg = `Filter value comparsion not valid [${k}].`;
					throw urn_exc.create('FIELD_INVALID_COMP', err_msg);
				}
				if(typeof field[k] != 'string' && field[k] != 'number' && !Array.isArray(field[k])){
					const err_msg = `Filter comparsion value type must be a string, a number, on an Array [${k}]`;
					throw urn_exc.create('FIELD_INVALID_COMP_TYPE', err_msg);
				}
				if(Array.isArray(field[k])){
					for(const v of field[k]){
						if(typeof v !== 'string' && typeof v !== 'number'){
							const err_msg = `Invalid filter comparsion value type.`;
							throw urn_exc.create('FIELD_INVALID_VAL_TYPE', err_msg);
						}
					}
				}
			}
			return true;
		}
		default:{
			const err_msg = `Filter filed type not valid.`;
			throw urn_exc.create('FIELD_INVALID_TYPE', err_msg);
		}
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
function validate_filter<M extends urn_atms.models.Resource>
(filter:FilterType<M>, atom_properties:AtomProperties)
		:true{
	if(typeof filter !== 'object' || filter === null){
		const err_msg = `Invalid filter format.`;
		throw urn_exc.create('FILTER_INVALID_TYPE', err_msg);
	}
	let key:keyof FilterType<M>;
	for(key in filter){
		if(urn_util.object.has_key(_queryop.andornor, key)){
		// if(_queryop.andornor.indexOf(key) !== -1){
			if(!Array.isArray(filter[key])){
				const err_msg = `Invalid filter format. Filter value for [${key}] must be an array.`;
				throw urn_exc.create('FILTER_OP_VAL_NOT_ARRAY', err_msg);
			}
			for(let i=0; i < filter[key]!.length; i++){
				validate_filter(filter[key]![i], atom_properties);
			}
		}else{
			if(!urn_util.object.has_key(atom_properties, key)){
				const err_msg = `Filter field not valid [${key}].`;
				throw urn_exc.create('FILTER_INVALID_KEY', err_msg);
			}
			_validate_field(filter[key]);
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
function validate_options<M extends urn_atms.models.Resource>
(options:QueryOptions<M>, atom_properties:AtomProperties)
		:true{
	if(urn_util.object.has_key(options, 'sort')){
		switch(typeof options.sort){
			case 'string':{
				let sort_value = options.sort;
				if(options.sort[0] == '+' || options.sort[0] == '-'){
					sort_value = sort_value.substring(1, options.sort.length);
				}
				if(!urn_util.object.has_key(atom_properties, sort_value)){
					const err_msg = `Sort value not valid [${options.sort}].`;
					throw urn_exc.create('OPTIONS_INVALID_SORT_VAL', err_msg);
				}
				break;
			}
			case 'object':{
				for(const k in options.sort){
					if(!urn_util.object.has_key(atom_properties, k)){
						const err_msg = `Sort value not valid [${k}].`;
						throw urn_exc.create('OPTIONS_INVALID_OBJECT_SORT_VAL', err_msg);
					}
					const sort_obj_value = options.sort[k];
					if(isNaN(sort_obj_value) || (sort_obj_value != -1 && sort_obj_value != 1)){
						const err_msg = `Sort value must be equal either to -1 or 1.`;
						throw urn_exc.create('OPTIONS_INVALID_VAL', err_msg);
					}
				}
				break;
			}
		}
	}
	if(urn_util.object.has_key(options,'limit') && typeof options.limit != 'number'){
		const err_msg = `Limit value type must be number.`;
		throw urn_exc.create('OPTIONS_INVALID_LIMIT_VAL', err_msg);
	}
	if(urn_util.object.has_key(options,'skip') && typeof options.skip != 'number'){
		const err_msg = `Skip value type must be number.`;
		throw urn_exc.create('OPTIONS_INVALID_SKIP_VAL', err_msg);
	}
	return true;
}

/**
 * Validate projection object for querying Relation. used in find, find_one, ...
 *
 * @param projection - The projection to validate
 *
 */
// _validate_projection(projection:FilterType<R> | string)
//     :true | never{
//   switch(typeof projection){
//     case 'string':{
//       if(urn_util.object.has_key(this._approved_keys, projection)){
//         return true;
//       }
//       const splitted = projection.split(' ');
//       const first_chars = splitted.map(v => v[0]);
//       if(first_chars.indexOf('-') !== -1 && !first_chars.every(v => v === first_chars[0])){
//         throw urn_exception.create('Projection cannot have a mix of including and excluding');
//       }
//       for(let i=0; i < splitted.length; i++){
//         const s = splitted[i];
//         if(s[0] == '-' || s[0] == '+'){
//           const substring = s.substring(1, s.length);
//           if(!urn_util.object.has_key(this._approved_keys, substring))
//             throw urn_exception.create(`Projection invalid [${s}]`);
//         }else{
//           if(!urn_util.object.has_key(this._approved_keys, s))
//             throw urn_exception.create(`Projection invalid [${s}]`);
//         }
//       }
//       return true;
//     }
//     case 'object':{
//       for(const k in projection){
//         if(!urn_util.object.has_key(this._approved_keys, k)){
//           throw urn_exception.create(`Projection invalid [${k}]`);
//         }
//         if(projection[k] != 1 && projection[k] != 0){
//           throw urn_exception.create(`Projection invalid [${k}]`);
//         }
//       }
//       return true;
//     }
//     default:{
//       throw urn_exception.create('Projection has an invalid type');
//     }
//   }
// }
