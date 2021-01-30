"use strict";
/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_mongo_schema_def = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// import {urn_exception, urn_util} from 'urn-lib';
const urn_lib_1 = require("urn-lib");
// const urn_exc = urn_exception.init('MONGO_SCHEMA', 'Mongoose Schema Definition');
const urn_atm = __importStar(require("../../atm/"));
const types_1 = require("../../types");
const book_1 = require("../../../book");
// function _generate_schemas(){
//   const schema_by_atom_name = new Map<AtomName, mongoose.SchemaDefinition>();
//   let atom_name:AtomName;
//   for(atom_name in atom_book){
//     schema_by_atom_name.set(atom_name, _generate_mongo_schema_def(atom_name));
//   }
//   return schema_by_atom_name;
// }
// const _mongo_schema_by_atom_name = _generate_schemas();
function generate_mongo_schema_def(atom_name) {
    const props_def = book_1.atom_book[atom_name]['properties'];
    const properties = Object.assign(Object.assign(Object.assign({}, types_1.atom_hard_properties), types_1.atom_common_properties), props_def);
    let mongoose_schema_def = {};
    for (const [k, v] of Object.entries(properties)) {
        if (k === '_id')
            continue;
        mongoose_schema_def = Object.assign(Object.assign({}, mongoose_schema_def), { [k]: Object.assign({}, _generate_mongoose_schema_type_options(atom_name, v, k)) });
    }
    // console.log(mongoose_schema_def);
    return mongoose_schema_def;
}
exports.generate_mongo_schema_def = generate_mongo_schema_def;
function _generate_mongoose_schema_type_options(atom_name, prop_def, prop_key) {
    let is_required = true;
    if (prop_def.optional && prop_def.optional === true) {
        is_required = false;
    }
    if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, prop_key)) {
        is_required = false;
    }
    let schema_type_options = {
        required: is_required
    };
    if (prop_def.unique && prop_def.unique === true) {
        schema_type_options = Object.assign(Object.assign({}, schema_type_options), { unique: true });
    }
    switch (prop_def.type) {
        case "ID" /* ID */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: mongoose_1.default.Schema.Types.ObjectId });
            return schema_type_options;
        }
        case "TEXT" /* TEXT */: {
            return _generate_string_schema_options(prop_def, schema_type_options);
        }
        case "LONG_TEXT" /* LONG_TEXT */: {
            return _generate_string_schema_options(prop_def, schema_type_options);
        }
        case "ENCRYPTED" /* ENCRYPTED */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: String, minlength: 60, maxlenght: 60 });
            return schema_type_options;
        }
        case "EMAIL" /* EMAIL */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, type: String, trim: true });
            return schema_type_options;
        }
        case "INTEGER" /* INTEGER */: {
            return _generate_number_schema_options(prop_def, schema_type_options);
        }
        case "FLOAT" /* FLOAT */: {
            return _generate_number_schema_options(prop_def, schema_type_options);
        }
        case "BINARY" /* BINARY */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: Boolean });
            return schema_type_options;
        }
        case "TIME" /* TIME */: {
            return _generate_date_schema_options(prop_def, schema_type_options);
        }
        case "ENUM_STRING" /* ENUM_STRING */: {
            return _generate_enum_schema_options(prop_def, schema_type_options, 'string');
        }
        case "ENUM_NUMBER" /* ENUM_NUMBER */: {
            return _generate_enum_schema_options(prop_def, schema_type_options, 'number');
        }
        case "SET_STRING" /* SET_STRING */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: [String] });
            return schema_type_options;
        }
        case "SET_NUMBER" /* SET_NUMBER */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: [Number] });
            return schema_type_options;
        }
        case "ATOM" /* ATOM */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: mongoose_1.default.Schema.Types.ObjectId, ref: urn_atm.get_subatom_name(atom_name, prop_key) });
            return schema_type_options;
        }
        case "ATOM_ARRAY" /* ATOM_ARRAY */: {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: [mongoose_1.default.Schema.Types.ObjectId], ref: urn_atm.get_subatom_name(atom_name, prop_key) });
            return schema_type_options;
        }
    }
    // const err_msg = `Invalid Atom property type for key [${prop_key}]`;
    // throw urn_exc.create('CREATE_PROP_SCHEMA_INVALID_TYPE', err_msg);
}
function _generate_date_schema_options(prop_def, schema_type_options) {
    schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: Date });
    if (prop_def.default) {
        schema_type_options = Object.assign(Object.assign({}, schema_type_options), { default: (prop_def.default === 'NOW') ? Date.now : prop_def.default });
    }
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.eq) {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { min: vali.eq, max: vali.eq });
        }
        else {
            if (vali.min) {
                schema_type_options = Object.assign(Object.assign({}, schema_type_options), { min: vali.min });
            }
            if (vali.max) {
                schema_type_options = Object.assign(Object.assign({}, schema_type_options), { max: vali.max });
            }
        }
    }
    return schema_type_options;
}
function _generate_enum_schema_options(prop_def, schema_type_options, type) {
    schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: (type === 'number') ? Number : String, enum: prop_def.values });
    if (prop_def.default) {
        schema_type_options = Object.assign(Object.assign({}, schema_type_options), { default: prop_def.default });
    }
    return schema_type_options;
}
function _generate_number_schema_options(prop_def, schema_type_options) {
    schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: Number });
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.eq) {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { min: vali.eq, max: vali.eq });
        }
        else {
            if (vali.min) {
                schema_type_options = Object.assign(Object.assign({}, schema_type_options), { min: vali.min });
            }
            if (vali.max) {
                schema_type_options = Object.assign(Object.assign({}, schema_type_options), { max: vali.max });
            }
        }
    }
    return schema_type_options;
}
function _generate_string_schema_options(prop_def, schema_type_options) {
    schema_type_options = Object.assign(Object.assign({}, schema_type_options), { type: String, trim: true });
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.length) {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { minlength: vali.length, maxlenght: vali.length });
        }
        else {
            if (vali.min) {
                schema_type_options = Object.assign(Object.assign({}, schema_type_options), { minlength: vali.min });
            }
            if (vali.max) {
                schema_type_options = Object.assign(Object.assign({}, schema_type_options), { maxlength: vali.max });
            }
        }
        if (vali.reg_ex) {
            schema_type_options = Object.assign(Object.assign({}, schema_type_options), { match: vali.reg_ex });
        }
    }
    return schema_type_options;
}
//# sourceMappingURL=schema.js.map