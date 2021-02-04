/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */

import {atom_book} from 'urn_book';

import {urn_exception, urn_util} from 'urn-lib';

import {core_config} from '../conf/defaults';

import {Depth, Query, AtomName} from '../types';


const _query_op_keys = {
	array_op: ['$and', '$nor', '$or'],
	equal_op: ['$not'],
	compa_op: ['$eq', '$gt', '$gte', '$in', '$lt', '$lte', '$ne', '$nin']
};

const urn_exc = urn_exception.init('QUERY_VALIDATE','Query Validator');

/**
 * Validate `query` and `options` paramaters
 *
 * @param atom_name - The Atom module that is needed to check the keys
 * @param query - the query object
 * @param options- the options object
 */
export function validate_filter_options_params<A extends AtomName, D extends Depth>
(atom_name:A, query:Query<A>, options?:Query.Options<A,D>)
		:true{
	validate_filter<A>(query, atom_name);
	if(options){
		validate_options(options, atom_name);
	}
	return true;
}

/**
 * Validate single field of a query object
 *
 * @param field - The field to validate
 *
 */
function _validate_expression<A extends AtomName>(field:Query.Expression<A>)
		:true{
	if(field === undefined || field === null || typeof field !== 'object'){
		const err_msg = `Cannot _validate_expression. Invalid expression type.`;
		throw urn_exc.create('INVALID_EXPRESSION_TYPE', err_msg);
	}
	if(Object.keys(field).length > 1){
		const err_msg = `Invalid expression. Expression must have only one key set.`;
		throw urn_exc.create('INVALID_EXPRESSION_MULTIPLE_KEYS', err_msg);
	}
	for(const [k,v] of Object.entries(field)){
		if(_query_op_keys.equal_op.includes(k)){
			return _validate_expression<A>(v);
		}else{
			switch(typeof v){
				case 'string':
				case 'number':
					return true;
				case 'object':{
					for(const [l,u] of Object.entries(v)){
						if(!_query_op_keys.compa_op.includes(l)){
							const err_msg = `Filter value comparsion not valid [${l}].`;
							throw urn_exc.create('FIELD_INVALID_COMP', err_msg);
						}
						if(!Array.isArray(u) && !_is_base_query_type(u)){
							let err_msg = `Filter comparsion value type must be`;
							err_msg += ` a string, a number, a date or an Array [${l}]`;
							throw urn_exc.create('FIELD_INVALID_COMP_TYPE', err_msg);
						}
						if(Array.isArray(u)){
							const are_all_valid_values = u.every((val) => {
								return _is_base_query_type(val);
							});
							if(!are_all_valid_values){
								const err_msg = `Invalid query comparsion value type.`;
								throw urn_exc.create('FIELD_INVALID_VAL_TYPE', err_msg);
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
	}
	return true;
}

function _is_base_query_type(val:any)
		:boolean{
	return (typeof val === 'string' || val === 'number' ||  urn_util.is.date(val));
}

/**
 * Validate query object for querying Relation. used in find, find_one, ...
 *
 * query must be in format:
 * - {key: value} where key is key of R
 * - {$and|$or|$nor: [{key: value},{key: value}, ...]}
 * - {$and|$or|$nor: [{$and|$or|$nor: [...], ...]}
 *
 * @param query - The query to validate
 */
function validate_filter<A extends AtomName>(query:Query<A>, atom_name:A)
		:true{
	if(typeof query !== 'object' || query === null || query === undefined){
		const err_msg = `Invalid query format.`;
		throw urn_exc.create('FILTER_INVALID_TYPE', err_msg);
	}
	for(const [key, value] of Object.entries(query)){
		if(_query_op_keys.array_op.includes(key)){
			if(!Array.isArray(value)){
				const err_msg = `Invalid query format. Filter value for [${key}] must be an array.`;
				throw urn_exc.create('FILTER_OP_VAL_NOT_ARRAY', err_msg);
			}else{
				for(let i=0; i < value.length; i++){
					validate_filter(value[i], atom_name);
				}
			}
		}else{
			_validate_expression<A>({[key]: value} as any);
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
function validate_options<A extends AtomName, D extends Depth>(options:Query.Options<A,D>, atom_name:A)
		:true{
	if(options.sort){
		switch(typeof options.sort){
			case 'string':{
				let sort_value = options.sort;
				if(options.sort[0] == '+' || options.sort[0] == '-'){
					sort_value = sort_value.substring(1, options.sort.length);
				}
				if(!urn_util.object.has_key(atom_book[atom_name].properties, sort_value)){
					const err_msg = `Sort value not valid [${options.sort}].`;
					throw urn_exc.create('OPTIONS_INVALID_SORT_VAL', err_msg);
				}
				break;
			}
			case 'object':{
				for(const k in options.sort){
					if(!urn_util.object.has_key(atom_book[atom_name].properties, k)){
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
	if(options.limit && typeof options.limit != 'number'){
		const err_msg = `options.limit value type must be number.`;
		throw urn_exc.create('OPTIONS_INVALID_LIMIT_VAL', err_msg);
	}
	if(options.skip && typeof options.skip != 'number'){
		const err_msg = `option.skip value type must be number.`;
		throw urn_exc.create('OPTIONS_INVALID_SKIP_VAL', err_msg);
	}
	if(options.depth){
		if(typeof options.depth != 'number'){
			const err_msg = `options.depth value type must be number.`;
			throw urn_exc.create('OPTIONS_INVALID_DEPTH_TYPE', err_msg);
		}
		if(options.depth > core_config.max_query_depth_allowed){
			let err_msg = `options.depth is gratern than maximun allowed`;
			err_msg += ` [${core_config.max_password_length}]`;
			throw urn_exc.create('OPTIONS_INVALID_DEPTH_VAL', err_msg);
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
// _validate_projection(projection:Query<R> | string)
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
