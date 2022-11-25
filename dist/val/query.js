"use strict";
/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_filter_options_params = void 0;
const uranio_utils_1 = require("uranio-utils");
const conf = __importStar(require("../conf/server"));
const atm_util = __importStar(require("../atm/util"));
const book = __importStar(require("../book/client"));
const _query_op_keys = {
    array_op: ['$and', '$nor', '$or'],
    equal_op: ['$not'],
    compa_op: ['$eq', '$gt', '$gte', '$in', '$lt', '$lte', '$ne', '$nin', '$regex', '$options', '$all']
};
const _options_keys = ['depth', 'sort', 'limit', 'skip', 'depth_query'];
const urn_exc = uranio_utils_1.urn_exception.init('QUERY_VALIDATE', 'schema.Query Validator');
/**
 * Validate `query` and `options` paramaters
 *
 * @param atom_name - The schema.Atom module that is needed to check the keys
 * @param query - the query object
 * @param options - the options object
 */
function validate_filter_options_params(atom_name, query, options) {
    validate_filter(query, atom_name);
    if (options) {
        validate_options(options, atom_name);
    }
    return true;
}
exports.validate_filter_options_params = validate_filter_options_params;
/**
 * Validate single field of a query object
 *
 * @param field - The field to validate
 *
 */
function _validate_expression(field, atom_name) {
    if (field === undefined || field === null || typeof field !== 'object') {
        const err_msg = `Cannot _validate_expression. Invalid expression type.`;
        throw urn_exc.create_invalid_request('INVALID_EXPRESSION_TYPE', err_msg);
    }
    if (uranio_utils_1.urn_util.object.has_key(field, '$text') && uranio_utils_1.urn_util.object.has_key(field['$text'], '$search')) {
        if (typeof field['$text']['$search'] !== 'string') {
            const err_msg = `Invalid search text query format.`;
            throw urn_exc.create_invalid_request('FILTER_INVALID_EXPRESSION_SEARCH_TEXT_TYPE', err_msg);
        }
        return true;
    }
    if (Object.keys(field).length > 1) {
        const err_msg = `Invalid expression. Expression must have only one key set.`;
        throw urn_exc.create_invalid_request('INVALID_EXPRESSION_MULTIPLE_KEYS', err_msg);
    }
    for (const [k, v] of Object.entries(field)) {
        if (_query_op_keys.equal_op.includes(k)) {
            return _validate_expression(v, atom_name);
        }
        else {
            if (!atm_util.has_property(atom_name, k)) {
                const err_msg = `Invalid filter key \`${k}\` for schema.Atom \`${atom_name}\`.`;
                throw urn_exc.create_invalid_request('INVALID_EXPRESSION_KEY', err_msg);
            }
            switch (typeof v) {
                case 'boolean':
                case 'string':
                case 'number':
                case 'undefined':
                    return true;
                case 'object': {
                    for (const [l, u] of Object.entries(v)) {
                        if (!_query_op_keys.compa_op.includes(l)) {
                            const err_msg = `Filter value comparsion not valid \`${l}\`.`;
                            throw urn_exc.create_invalid_request('FIELD_INVALID_COMP', err_msg);
                        }
                        if (!Array.isArray(u) && !_is_base_query_type(u)) {
                            let err_msg = `Filter comparsion value type must be`;
                            err_msg += ` a string, a number, a date, an Array or \`undefined\` \`${l}\``;
                            throw urn_exc.create_invalid_request('FIELD_INVALID_COMP_TYPE', err_msg);
                        }
                        if (Array.isArray(u)) {
                            const are_all_valid_values = u.every((val) => {
                                return _is_base_query_type(val);
                            });
                            if (!are_all_valid_values) {
                                const err_msg = `Invalid query comparsion value type.`;
                                throw urn_exc.create_invalid_request('FIELD_INVALID_VAL_TYPE', err_msg);
                            }
                        }
                    }
                    return true;
                }
                default: {
                    const err_msg = `Filter filed type not valid. Type of \`${k}\` is \`${typeof v}\`.`;
                    throw urn_exc.create_invalid_request('FIELD_INVALID_TYPE', err_msg);
                }
            }
        }
    }
    return true;
}
function _is_base_query_type(val) {
    return (typeof val === 'string' || val === 'number' || uranio_utils_1.urn_util.is.date(val) || typeof val === 'undefined');
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
function validate_filter(query, atom_name) {
    if (typeof query !== 'object' || query === null || query === undefined) {
        const err_msg = `Invalid query format.`;
        throw urn_exc.create_invalid_request('FILTER_INVALID_TYPE', err_msg);
    }
    if (uranio_utils_1.urn_util.object.has_key(query, '$text') && uranio_utils_1.urn_util.object.has_key(query['$text'], '$search')) {
        if (typeof query['$text']['$search'] !== 'string') {
            const err_msg = `Invalid search text query format.`;
            throw urn_exc.create_invalid_request('FILTER_INVALID_SEARCH_TEXT_TYPE', err_msg);
        }
        return true;
    }
    for (const [key, value] of Object.entries(query)) {
        if (_query_op_keys.array_op.includes(key)) {
            if (!Array.isArray(value)) {
                const err_msg = `Invalid query format. Filter value for \`${key}\` must be an array.`;
                throw urn_exc.create_invalid_request('FILTER_OP_VAL_NOT_ARRAY', err_msg);
            }
            else {
                for (let i = 0; i < value.length; i++) {
                    validate_filter(value[i], atom_name);
                }
            }
        }
        else {
            _validate_expression({ [key]: value }, atom_name);
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
function validate_options(options, atom_name) {
    if (Object.keys(options).length > _options_keys.length) {
        throw urn_exc.create_invalid_request('OPTIONS_INVALID_KEYS', `Options param has an invalid property.`);
    }
    for (const k in options) {
        if (!_options_keys.includes(k)) {
            const err_msg = `Invalid property for options param \`${k}\``;
            throw urn_exc.create_invalid_request('OPTIONS_INVALID_KEY', err_msg);
        }
    }
    if (options.sort) {
        switch (typeof options.sort) {
            case 'string': {
                let sort_value = options.sort;
                if (options.sort[0] === '+' || options.sort[0] === '-') {
                    sort_value = sort_value.substring(1, options.sort.length);
                }
                const prop_defs = book.get_custom_properties_definition(atom_name);
                if (!uranio_utils_1.urn_util.object.has_key(prop_defs, sort_value)) {
                    const err_msg = `Sort value not valid \`${options.sort}\`.`;
                    throw urn_exc.create_invalid_request('OPTIONS_INVALID_SORT_VAL', err_msg);
                }
                break;
            }
            case 'object': {
                for (const k in options.sort) {
                    if (!atm_util.has_property(atom_name, k)) {
                        const err_msg = `Sort value not valid \`${k}\`.`;
                        throw urn_exc.create_invalid_request('OPTIONS_INVALID_OBJECT_SORT_VAL', err_msg);
                    }
                    const sort_obj_value = options.sort[k];
                    if (isNaN(sort_obj_value) || (sort_obj_value != -1 && sort_obj_value != 1)) {
                        const err_msg = `Sort value must be equal either to -1 or 1.`;
                        throw urn_exc.create_invalid_request('OPTIONS_INVALID_VAL', err_msg);
                    }
                }
                break;
            }
        }
    }
    if (options.limit) {
        options.limit = +options.limit;
        if (typeof options.limit !== 'number') {
            const err_msg = `options.limit value type must be number.`;
            throw urn_exc.create_invalid_request('OPTIONS_INVALID_LIMIT_VAL', err_msg);
        }
    }
    if (options.skip) {
        options.skip = +options.skip;
        if (typeof options.skip !== 'number') {
            const err_msg = `option.skip value type must be number.`;
            throw urn_exc.create_invalid_request('OPTIONS_INVALID_SKIP_VAL', err_msg);
        }
    }
    if (options.depth) {
        options.depth = +options.depth;
        if (typeof options.depth !== 'number') {
            const err_msg = `options.depth value type must be number.`;
            throw urn_exc.create_invalid_request('OPTIONS_INVALID_DEPTH_TYPE', err_msg);
        }
        if (options.depth > conf.get(`max_query_depth_allowed`)) {
            let err_msg = `options.depth is gratern than maximun allowed`;
            err_msg += ` [${conf.get(`max_password_length`)}]`;
            throw urn_exc.create_invalid_request('OPTIONS_INVALID_DEPTH_VAL', err_msg);
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
// _validate_projection(projection:schema.Query<R> | string)
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
//# sourceMappingURL=query.js.map