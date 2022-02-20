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
const urn_lib_1 = require("urn-lib");
const index_1 = require("../../stc/index");
const atm_util = __importStar(require("../../atm/util"));
const book = __importStar(require("../../book/index"));
const book_srv_1 = require("../../typ/book_srv");
function generate_mongo_schema_def(atom_name) {
    const properties = book.get_full_properties_definition(atom_name);
    let mongoose_schema_def = {};
    for (const [k, v] of Object.entries(properties)) {
        if (k === '_id')
            continue;
        mongoose_schema_def = {
            ...mongoose_schema_def,
            [k]: { ..._generate_mongoose_schema_type_options(atom_name, v, k) }
        };
    }
    return mongoose_schema_def;
}
exports.generate_mongo_schema_def = generate_mongo_schema_def;
function _generate_mongoose_schema_type_options(atom_name, prop_def, prop_key) {
    let is_required = true;
    if (prop_def.optional && prop_def.optional === true) {
        is_required = false;
    }
    if (urn_lib_1.urn_util.object.has_key(index_1.atom_hard_properties, prop_key)) {
        is_required = false;
    }
    let schema_type_options = {
        type: undefined,
        required: is_required
    };
    if (prop_def.unique && prop_def.unique === true) {
        schema_type_options = {
            ...schema_type_options,
            ...{ unique: true }
        };
    }
    switch (prop_def.type) {
        case book_srv_1.PropertyType.ID: {
            schema_type_options = {
                ...schema_type_options,
                type: mongoose_1.default.Schema.Types.ObjectId
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.TEXT: {
            return _generate_string_schema_options(prop_def, schema_type_options);
        }
        case book_srv_1.PropertyType.LONG_TEXT: {
            return _generate_string_schema_options(prop_def, schema_type_options);
        }
        case book_srv_1.PropertyType.ENCRYPTED: {
            schema_type_options = {
                ...schema_type_options,
                type: String,
                minlength: 60,
                maxlenght: 60
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.EMAIL: {
            schema_type_options = {
                ...schema_type_options,
                match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                type: String,
                trim: true
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.INTEGER: {
            return _generate_number_schema_options(prop_def, schema_type_options);
        }
        case book_srv_1.PropertyType.FLOAT: {
            return _generate_number_schema_options(prop_def, schema_type_options);
        }
        case book_srv_1.PropertyType.BINARY: {
            schema_type_options = {
                ...schema_type_options,
                type: Boolean
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.DAY:
        case book_srv_1.PropertyType.TIME: {
            return _generate_date_schema_options(prop_def, schema_type_options);
        }
        case book_srv_1.PropertyType.ENUM_STRING: {
            return _generate_enum_schema_options(prop_def, schema_type_options, 'string');
        }
        case book_srv_1.PropertyType.ENUM_NUMBER: {
            return _generate_enum_schema_options(prop_def, schema_type_options, 'number');
        }
        case book_srv_1.PropertyType.SET_STRING: {
            schema_type_options = {
                ...schema_type_options,
                type: [String]
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.SET_NUMBER: {
            schema_type_options = {
                ...schema_type_options,
                type: [Number]
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.ATOM: {
            schema_type_options = {
                ...schema_type_options,
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: atm_util.get_subatom_name(atom_name, prop_key)
            };
            return schema_type_options;
        }
        case book_srv_1.PropertyType.ATOM_ARRAY: {
            schema_type_options = {
                ...schema_type_options,
                type: [mongoose_1.default.Schema.Types.ObjectId],
                ref: atm_util.get_subatom_name(atom_name, prop_key)
            };
            return schema_type_options;
        }
    }
    // const err_msg = `Invalid schema.schema.Atom property type for key [${prop_key}]`;
    // throw urn_exc.create('CREATE_PROP_SCHEMA_INVALID_TYPE', err_msg);
}
function _generate_date_schema_options(prop_def, schema_type_options) {
    schema_type_options = {
        ...schema_type_options,
        type: Date
    };
    if (prop_def.default) {
        schema_type_options = {
            ...schema_type_options,
            default: (prop_def.default === 'NOW') ? Date.now : prop_def.default
        };
    }
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.eq) {
            schema_type_options = {
                ...schema_type_options,
                min: vali.eq,
                max: vali.eq
            };
        }
        else {
            if (vali.min) {
                schema_type_options = {
                    ...schema_type_options,
                    min: vali.min
                };
            }
            if (vali.max) {
                schema_type_options = {
                    ...schema_type_options,
                    max: vali.max
                };
            }
        }
    }
    return schema_type_options;
}
function _generate_enum_schema_options(prop_def, schema_type_options, type) {
    schema_type_options = {
        ...schema_type_options,
        type: (type === 'number') ? Number : String,
        enum: prop_def.values
    };
    if (prop_def.default) {
        schema_type_options = {
            ...schema_type_options,
            default: prop_def.default
        };
    }
    return schema_type_options;
}
function _generate_number_schema_options(prop_def, schema_type_options) {
    schema_type_options = {
        ...schema_type_options,
        type: Number
    };
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.eq) {
            schema_type_options = {
                ...schema_type_options,
                min: vali.eq,
                max: vali.eq
            };
        }
        else {
            if (vali.min) {
                schema_type_options = {
                    ...schema_type_options,
                    min: vali.min
                };
            }
            if (vali.max) {
                schema_type_options = {
                    ...schema_type_options,
                    max: vali.max
                };
            }
        }
    }
    return schema_type_options;
}
function _generate_string_schema_options(prop_def, schema_type_options) {
    schema_type_options = {
        ...schema_type_options,
        type: String,
        trim: true
    };
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.length) {
            schema_type_options = {
                ...schema_type_options,
                minlength: vali.length,
                maxlenght: vali.length
            };
        }
        else {
            if (vali.min) {
                schema_type_options = {
                    ...schema_type_options,
                    minlength: vali.min
                };
            }
            if (vali.max) {
                schema_type_options = {
                    ...schema_type_options,
                    maxlength: vali.max
                };
            }
        }
        if (vali.reg_ex) {
            schema_type_options = {
                ...schema_type_options,
                match: vali.reg_ex
            };
        }
    }
    return schema_type_options;
}
//# sourceMappingURL=schema.js.map