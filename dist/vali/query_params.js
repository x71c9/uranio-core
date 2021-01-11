"use strict";
/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_options = exports.validate_filter = exports.validate_filter_options_params = void 0;
const urn_lib_1 = require("urn-lib");
const _queryop = {
    andornor: ['$and', '$or', '$nor', '$not'],
    comparsion: ['$eq', '$gt', '$gte', '$in', '$lt', '$lte', '$ne', '$nin']
};
/**
 * Validate `filter` and `options` paramaters
 *
 * @param atom_module - The Atom module that is needed to check the keys
 * @param filter - the filter object
 * @param options- the options object
 */
function validate_filter_options_params(atom_module, filter, options) {
    try {
        validate_filter(filter, atom_module);
        if (options) {
            validate_options(options, atom_module);
        }
    }
    catch (err) {
        throw urn_lib_1.urn_error.create(`Invalid query paramters`, err);
    }
    return true;
}
exports.validate_filter_options_params = validate_filter_options_params;
/**
 * Validate single field of a filter object
 *
 * @param field - The field to validate
 *
 */
function _validate_field(field) {
    if (field === null) {
        throw urn_lib_1.urn_error.create('Invalid filter value format');
    }
    switch (typeof field) {
        case 'string':
        case 'number':
            return true;
        case 'object': {
            for (const k in field) {
                if (_queryop.comparsion.indexOf(k) === -1) {
                    throw urn_lib_1.urn_error.create(`Filter value comparsion not valid [${k}]`);
                }
                if (typeof field[k] != 'string' && field[k] != 'number' && !Array.isArray(field[k])) {
                    throw urn_lib_1.urn_error.create(`Filter comparsion value type must be a string, a number, on an Array [${k}]`);
                }
                if (Array.isArray(field[k])) {
                    for (const v of field[k]) {
                        if (typeof v !== 'string' && typeof v !== 'number') {
                            throw urn_lib_1.urn_error.create(`Invalid filter comparsion value type`);
                        }
                    }
                }
            }
            return true;
        }
        default:
            throw urn_lib_1.urn_error.create('Filter filed type not valid');
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
function validate_filter(filter, atom_module) {
    if (typeof filter !== 'object' || filter === null) {
        throw urn_lib_1.urn_error.create(`Invalid filter format`);
    }
    let key;
    for (key in filter) {
        if (_queryop.andornor.indexOf(key) !== -1) {
            if (!Array.isArray(filter[key])) {
                throw urn_lib_1.urn_error.create(`Invalid filter format. Filter value for [${key}] must be an array`);
            }
            for (let i = 0; i < filter[key].length; i++) {
                validate_filter(filter[key][i], atom_module);
            }
        }
        else {
            if (!atom_module.keys.approved.has(key)) {
                throw urn_lib_1.urn_error.create(`Filter field not valid [${key}]`);
            }
            try {
                _validate_field(filter[key]);
            }
            catch (err) {
                throw urn_lib_1.urn_error.create(`Invalid filter value`, err);
            }
        }
    }
    return true;
}
exports.validate_filter = validate_filter;
/**
 * Validate option object|string for querying Relation. Used in find, findOne, ...
 *
 * @param object - The object or the string to validate as option
 *
 */
function validate_options(options, atom_module) {
    if (urn_lib_1.urn_util.object.has_key(options, 'sort')) {
        switch (typeof options.sort) {
            case 'string': {
                let sort_value = options.sort;
                if (options.sort[0] == '+' || options.sort[0] == '-') {
                    sort_value = sort_value.substring(1, options.sort.length);
                }
                if (!atom_module.keys.approved.has(sort_value)) {
                    throw urn_lib_1.urn_error.create(`Sort value not valid [${options.sort}]`);
                }
                break;
            }
            case 'object': {
                for (const k in options.sort) {
                    if (!atom_module.keys.approved.has(k)) {
                        throw urn_lib_1.urn_error.create(`Sort value not valid [${k}]`);
                    }
                    const sort_obj_value = options.sort[k];
                    if (isNaN(sort_obj_value) || (sort_obj_value != -1 && sort_obj_value != 1)) {
                        throw urn_lib_1.urn_error.create('Sort value must be equal either to -1 or 1');
                    }
                }
                break;
            }
        }
    }
    if (urn_lib_1.urn_util.object.has_key(options, 'limit') && typeof options.limit != 'number') {
        throw urn_lib_1.urn_error.create('Limit value type must be number');
    }
    if (urn_lib_1.urn_util.object.has_key(options, 'skip') && typeof options.skip != 'number') {
        throw urn_lib_1.urn_error.create('Skip value type must be number');
    }
    return true;
}
exports.validate_options = validate_options;
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
//# sourceMappingURL=query_params.js.map