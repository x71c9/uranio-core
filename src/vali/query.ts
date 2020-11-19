/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

import {QueryOptions, QueryFilter, FilterType} from '../types';

import * as urn_atms from '../atm/';

const _queryop = {
	andornor: ['$and','$or','$nor','$not'],
	comparsion: ['$eq','$gt','$gte','$in','$lt','$lte','$ne','$nin']
};

const urn_exc = urn_exception.init('QVAL','Query Validator');

/**
 * Validate `filter` and `options` paramaters
 *
 * @param atom_keys - The Atom module that is needed to check the keys
 * @param filter - the filter object
 * @param options- the options object
 */
export function validate_filter_options_params<M extends urn_atms.models.Resource>
(atom_keys:urn_atms.models.ModelKeysCategories<M>, filter:QueryFilter<M>, options?:QueryOptions<M>)
		:true{
	validate_filter<M>(filter, atom_keys);
	if(options){
		validate_options(options, atom_keys);
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
		throw urn_exc.create('VIF', err_msg);
	}
	switch(typeof field){
		case 'string':
		case 'number':
			return true;
		case 'object':{
			for(const k in field){
				if(_queryop.comparsion.indexOf(k) === -1){
					const err_msg = `Filter value comparsion not valid [${k}].`;
					throw urn_exc.create('VIC', err_msg);
				}
				if(typeof field[k] != 'string' && field[k] != 'number' && !Array.isArray(field[k])){
					const err_msg = `Filter comparsion value type must be a string, a number, on an Array [${k}]`;
					throw urn_exc.create('VCT', err_msg);
				}
				if(Array.isArray(field[k])){
					for(const v of field[k]){
						if(typeof v !== 'string' && typeof v !== 'number'){
							const err_msg = `Invalid filter comparsion value type.`;
							throw urn_exc.create('VCV', err_msg);
						}
					}
				}
			}
			return true;
		}
		default:{
			const err_msg = `Filter filed type not valid.`;
			throw urn_exc.create('VIN', err_msg);
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
(filter:FilterType<M>, atom_keys:urn_atms.models.ModelKeysCategories<M>)
		:true{
	if(typeof filter !== 'object' || filter === null){
		const err_msg = `Invalid filter format.`;
		throw urn_exc.create('FIF', err_msg);
	}
	let key:keyof FilterType<M>;
	for(key in filter){
		if(_queryop.andornor.indexOf(key) !== -1){
			if(!Array.isArray(filter[key])){
				const err_msg = `Invalid filter format. Filter value for [${key}] must be an array.`;
				throw urn_exc.create('FVA', err_msg);
			}
			for(let i=0; i < filter[key].length; i++){
				validate_filter(filter[key][i], atom_keys);
			}
		}else{
			if(!atom_keys.approved.has(key)){
				const err_msg = `Filter field not valid [${key}].`;
				throw urn_exc.create('FIN', err_msg);
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
(options:QueryOptions<M>, atom_keys:urn_atms.models.ModelKeysCategories<M>)
		:true{
	if(urn_util.object.has_key(options, 'sort')){
		switch(typeof options.sort){
			case 'string':{
				let sort_value = options.sort;
				if(options.sort[0] == '+' || options.sort[0] == '-'){
					sort_value = sort_value.substring(1, options.sort.length);
				}
				if(!atom_keys.approved.has(sort_value as keyof M)){
					const err_msg = `Sort value not valid [${options.sort}].`;
					throw urn_exc.create('OSI', err_msg);
				}
				break;
			}
			case 'object':{
				for(const k in options.sort){
					if(!atom_keys.approved.has(k)){
						const err_msg = `Sort value not valid [${k}].`;
						throw urn_exc.create('OSV', err_msg);
					}
					const sort_obj_value = options.sort[k];
					if(isNaN(sort_obj_value) || (sort_obj_value != -1 && sort_obj_value != 1)){
						const err_msg = `Sort value must be equal either to -1 or 1.`;
						throw urn_exc.create('OSO', err_msg);
					}
				}
				break;
			}
		}
	}
	if(urn_util.object.has_key(options,'limit') && typeof options.limit != 'number'){
		const err_msg = `Limit value type must be number.`;
		throw urn_exc.create('OLN', err_msg);
	}
	if(urn_util.object.has_key(options,'skip') && typeof options.skip != 'number'){
		const err_msg = `Skip value type must be number.`;
		throw urn_exc.create('OSN', err_msg);
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
