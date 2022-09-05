"use strict";
/**
 * Mongo Schema generator module
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_model = exports.create_all_connection = exports.mongo_app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// import {urn_util, urn_exception} from 'uranio-utils';
const uranio_utils_1 = require("uranio-utils");
const atm = __importStar(require("../../atm/server"));
const env = __importStar(require("../../env/server"));
const schema_1 = require("./schema");
const mongo_connection = __importStar(require("./connection"));
const book = __importStar(require("../../book/server"));
const book_1 = require("../../typ/book");
exports.mongo_app = {};
function create_all_connection() {
    _create_connection('main');
    _create_connection('trash');
    _create_connection('log');
}
exports.create_all_connection = create_all_connection;
function get_model(conn_name, atom_name) {
    _create_connection(conn_name);
    if (!exports.mongo_app.models) {
        exports.mongo_app.models = {};
    }
    if (!exports.mongo_app.models[conn_name]) {
        switch (conn_name) {
            case 'main': {
                exports.mongo_app.models.main = new Map();
                break;
            }
            case 'log': {
                exports.mongo_app.models.log = new Map();
                break;
            }
            case 'trash': {
                exports.mongo_app.models.trash = new Map();
                break;
            }
        }
    }
    // if(!mongo_app.models[conn_name]){
    // 	switch(conn_name){
    // 		case 'main':{
    // 			const undefined_connection_models = _create_models(mongo_app.connections!.main);
    // 			const main_connection_models = _create_models(mongo_app.connections!.main, 'main');
    // 			mongo_app.models.main = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>(
    // 				[...undefined_connection_models, ...main_connection_models]
    // 			);
    // 			break;
    // 		}
    // 		case 'log':{
    // 			mongo_app.models.log = _create_models(mongo_app.connections!.log, 'log');
    // 			break;
    // 		}
    // 		case 'trash':{
    // 			const model_by_atom_name = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
    // 			let atom_name:schema.AtomName;
    // 			for(atom_name of book.get_names()){
    // 				const atom_def = book.get_definition(atom_name);
    // 				if(atom_def.connection && atom_def.connection !== 'main'){
    // 					continue;
    // 				}
    // 				const atom_schema_def = _convert_for_trash(generate_mongo_schema_def(atom_name));
    // 				let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
    // 				atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
    // 				const atom_model = mongo_app.connections!.trash.create_model(atom_name, atom_mongo_schema);
    // 				model_by_atom_name.set(atom_name, atom_model);
    // 			}
    // 			mongo_app.models.trash = model_by_atom_name;
    // 			break;
    // 		}
    // 	}
    // }
    let model = exports.mongo_app.models[conn_name].get(atom_name);
    if (!model) {
        switch (conn_name) {
            case 'main': {
                _create_submodel(atom_name, exports.mongo_app.connections.main, 'main');
                model = _create_model(atom_name, exports.mongo_app.connections.main, 'main');
                break;
            }
            case 'log': {
                _create_submodel(atom_name, exports.mongo_app.connections.log, 'log');
                model = _create_model(atom_name, exports.mongo_app.connections.log, 'log');
                break;
            }
            case 'trash': {
                _create_submodel(atom_name, exports.mongo_app.connections.trash, 'trash');
                model = _create_model(atom_name, exports.mongo_app.connections.trash, 'trash');
                break;
            }
        }
    }
    return model;
}
exports.get_model = get_model;
function _create_model(atom_name, mongoose_db_connection, connection) {
    if (connection === 'trash') {
        const atom_schema_def = _convert_for_trash((0, schema_1.generate_mongo_schema_def)(atom_name));
        let atom_mongo_schema = new mongoose_1.default.Schema(atom_schema_def, { versionKey: false, strict: false });
        atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
        const atom_model = exports.mongo_app.connections.trash.create_model(atom_name, atom_mongo_schema);
        return atom_model;
    }
    else {
        const atom_schema_def = (0, schema_1.generate_mongo_schema_def)(atom_name);
        let atom_mongo_schema = new mongoose_1.default.Schema(atom_schema_def, { versionKey: false, strict: false });
        atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
        const conn_name = (!connection) ? 'main' : connection;
        atom_mongo_schema = _add_schema_middleware(atom_name, conn_name, atom_mongo_schema);
        const atom_model = mongoose_db_connection.create_model(atom_name, atom_mongo_schema);
        if (exports.mongo_app.models) {
            exports.mongo_app.models[conn_name].set(atom_name, atom_model);
        }
        return atom_model;
    }
}
function _create_submodel(atom_name, db_conn, conn_name) {
    const atom_props_def = book.get_properties_definition(atom_name);
    for (const [_prop_key, prop_def] of Object.entries(atom_props_def)) {
        if (prop_def.type === book_1.PropertyType.ATOM || prop_def.type === book_1.PropertyType.ATOM_ARRAY) {
            const subatom_name = prop_def.atom;
            if (exports.mongo_app.models && exports.mongo_app.models[conn_name] && !exports.mongo_app.models[conn_name].get(subatom_name)) {
                _create_model(subatom_name, db_conn, conn_name);
            }
        }
    }
}
// function _create_models(mongoose_db_connection:mongo_connection.ConnectionInstance, connection?:ConnectionName){
// 	const model_by_atom_name = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
// 	let atom_name:schema.AtomName;
// 	for(atom_name of book.get_names()){
// 		const atom_def = book.get_definition(atom_name);
// 		if(atom_def.connection !== connection){
// 			continue;
// 		}
// 		const atom_schema_def = generate_mongo_schema_def(atom_name);
// 		let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
// 		atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
// 		const conn_name = (!connection) ? 'main' : connection;
// 		atom_mongo_schema = _add_schema_middleware(atom_name, conn_name, atom_mongo_schema);
// 		const atom_model = mongoose_db_connection.create_model(atom_name, atom_mongo_schema);
// 		model_by_atom_name.set(atom_name, atom_model);
// 	}
// 	return model_by_atom_name;
// }
function _add_text_indexes(atom_mongo_schema, atom_name) {
    const searchable_indexed = atm.keys.get_search_indexes(atom_name);
    const mongo_indexes = {};
    for (const k of searchable_indexed) {
        mongo_indexes[k] = 'text';
    }
    atom_mongo_schema.index(mongo_indexes, { default_language: "english" });
    return atom_mongo_schema;
}
function _convert_for_trash(schema_definition) {
    const schema_without_unique = uranio_utils_1.urn_util.object.deep_clone(schema_definition);
    for (const [k] of Object.entries(schema_without_unique)) {
        schema_without_unique[k] = { type: 'Mixed' };
    }
    return schema_without_unique;
}
async function _delete_cascade(conn_name, atom_by_cascade_keys, document) {
    var _a;
    if (!document) {
        return false;
    }
    // const conn_models = models_by_connection.get(conn_name);
    const conn_models = (_a = exports.mongo_app.models) === null || _a === void 0 ? void 0 : _a[conn_name];
    if (!conn_models) {
        return false;
    }
    for (const [k, atom_name] of atom_by_cascade_keys) {
        const model = conn_models.get(atom_name);
        if (!model || !document[k]) {
            continue;
        }
        if (Array.isArray(document[k])) {
            const valid_ids = [];
            for (const id of document[k]) {
                if (mongoose_1.default.Types.ObjectId.isValid(id)) {
                    valid_ids.push(id);
                }
            }
            await model.deleteMany({ _id: { $in: valid_ids } });
        }
        else if (mongoose_1.default.Types.ObjectId.isValid(document[k])) {
            await model.findOneAndDelete({ _id: document[k] });
        }
    }
}
function _add_schema_middleware(atom_name, conn_name, mongo_schema) {
    // DELETE ON CASCADE
    const prop_defs = book.get_custom_properties_definition(atom_name);
    const atom_by_cascade_keys = new Map();
    for (const [k, v] of Object.entries(prop_defs)) {
        if (v.type === book_1.PropertyType.ATOM || v.type === book_1.PropertyType.ATOM_ARRAY) {
            if (v.delete_cascade && v.delete_cascade === true) {
                atom_by_cascade_keys.set(k, v.atom);
            }
        }
    }
    mongo_schema.post('findOneAndDelete', async (document) => {
        await _delete_cascade(conn_name, atom_by_cascade_keys, document);
    });
    mongo_schema.post('deleteMany', async (document) => {
        await _delete_cascade(conn_name, atom_by_cascade_keys, document);
    });
    mongo_schema.post('remove', async (document) => {
        await _delete_cascade(conn_name, atom_by_cascade_keys, document);
    });
    return mongo_schema;
}
function _create_connection(conn_name) {
    if (!exports.mongo_app.connections) {
        exports.mongo_app.connections = {};
    }
    if (!exports.mongo_app.connections[conn_name]) {
        const mongo_conn_string = env.get(`mongo_${conn_name}_connection`);
        const mongo_db_string = env.get(`db_${conn_name}_name`);
        const conf_connection_name = (conn_name !== 'main' && typeof mongo_conn_string === 'string') ?
            mongo_conn_string : env.get(`mongo_main_connection`);
        const conf_db_name = (conn_name !== 'main' && typeof mongo_conn_string === 'string') ?
            mongo_db_string : env.get(`db_main_name`);
        exports.mongo_app.connections[conn_name] = mongo_connection.create(conn_name, conf_connection_name, conf_db_name);
    }
}
//# sourceMappingURL=models.js.map