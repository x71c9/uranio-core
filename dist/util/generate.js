"use strict";
/**
 * Generate module
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
exports.init = exports.save_client_config = exports.client_config_and_save = exports.client_config = exports.save_schema = exports.schema_and_save = exports.schema = exports.process_params = void 0;
const fs_1 = __importDefault(require("fs"));
// import dateformat from 'dateformat';
const esbuild = __importStar(require("esbuild"));
const uranio_utils_1 = require("uranio-utils");
const urn_exc = uranio_utils_1.urn_exception.init(`REGISTER_MODULE`, `Register module.`);
const server_1 = require("../stc/server");
const defaults_1 = require("../conf/defaults");
const book = __importStar(require("../book/server"));
const types = __importStar(require("../srv/types"));
const toml = __importStar(require("./toml"));
exports.process_params = {
    urn_command: `schema`,
    urn_repo_path: 'node_modules/uranio',
    urn_schema_repo_path: 'node_modules/uranio-schema'
};
function schema() {
    uranio_utils_1.urn_log.trace('Started generating uranio core schema...');
    init();
    const text = _generate_uranio_schema_text();
    uranio_utils_1.urn_log.trace(`Core schema generated.`);
    return text;
}
exports.schema = schema;
function schema_and_save() {
    const text = schema();
    save_schema(text);
    uranio_utils_1.urn_log.trace(`Schema generated and saved.`);
}
exports.schema_and_save = schema_and_save;
function save_schema(text) {
    // const now = dateformat(new Date(), `yyyymmddHHMMssl`);
    // const backup_path = `${_get_atom_schema_path()}.${now}.bkp`;
    // fs.copyFileSync(_get_atom_schema_path(), backup_path);
    // urn_log.debug(`Copied backup file for atom schema in [${backup_path}].`);
    fs_1.default.writeFileSync(_get_atom_schema_path(), text);
    uranio_utils_1.urn_log.trace(`Updated schema [${_get_atom_schema_path()}].`);
}
exports.save_schema = save_schema;
function client_config(client_default) {
    uranio_utils_1.urn_log.trace('Started generating uranio core client config...');
    init();
    const text = _generate_client_config_text(client_default);
    uranio_utils_1.urn_log.trace(`Core client config generated.`);
    return text;
}
exports.client_config = client_config;
function client_config_and_save(client_default) {
    const text = client_config(client_default);
    save_client_config(text);
    uranio_utils_1.urn_log.trace(`Client config generated and saved.`);
}
exports.client_config_and_save = client_config_and_save;
function save_client_config(text) {
    fs_1.default.writeFileSync(_get_core_client_config_path_src(), text);
    uranio_utils_1.urn_log.trace(`Update core client config [${_get_core_client_config_path_src()}].`);
    _compile_client_config();
    uranio_utils_1.urn_log.trace(`Core Client config core generated and saved.`);
}
exports.save_client_config = save_client_config;
function init() {
    for (const argv of process.argv) {
        const splitted = argv.split('=');
        if (splitted[0] === 'urn_command'
            && typeof splitted[1] === 'string'
            && splitted[1] !== '') {
            exports.process_params.urn_command = splitted[1];
        }
        else if (splitted[0] === 'urn_schema_repo_path'
            && typeof splitted[1] === 'string'
            && splitted[1] !== '') {
            exports.process_params.urn_schema_repo_path = splitted[1];
        }
        else if (splitted[0] === 'urn_repo_path'
            && typeof splitted[1] === 'string'
            && splitted[1] !== '') {
            exports.process_params.urn_repo_path = splitted[1];
        }
        // if(
        //   splitted[0] === 'urn_base_schema'
        //   && typeof splitted[1] === 'string'
        //   && splitted[1] !== ''
        // ){
        //   process_params.urn_base_schema = splitted[1];
        // }else if(
        //   splitted[0] === 'urn_output_dir'
        //   && typeof splitted[1] === 'string'
        //   && splitted[1] !== ''
        // ){
        //   process_params.urn_output_dir = splitted[1];
        // }
    }
}
exports.init = init;
function _compile_client_config() {
    _compile(_get_core_client_config_path_src(), _get_core_client_config_path_dist());
}
function _compile(src, dest) {
    esbuild.buildSync({
        entryPoints: [src],
        outfile: dest,
        platform: 'node',
        format: 'cjs'
    });
    uranio_utils_1.urn_log.trace(`Core Compiled [${src}] to [${dest}].`);
}
function _get_core_client_config_path_src() {
    return `${exports.process_params.urn_repo_path}/src/cln/toml.ts`;
}
function _get_core_client_config_path_dist() {
    return `${exports.process_params.urn_repo_path}/dist/cln/toml.js`;
}
function _get_atom_schema_path() {
    return `${exports.process_params.urn_schema_repo_path}/dist/typ/atom.d.ts`;
}
function _read_schema() {
    return fs_1.default.readFileSync(_get_atom_schema_path(), { encoding: 'utf8' });
}
function _generate_client_config_text(client_default) {
    let text = '';
    text += `/**\n`;
    text += ` * Module for default client configuration object\n`;
    text += ` * Uranio \`generate\` script will replace this file with the client part\n`;
    text += ` * of the uranio.toml configration file.\n`;
    text += ` *\n`;
    text += ` * All properties starting with \`client_\` will populate this object.\n`;
    text += ` *\n`;
    text += ` * @packageDocumentation\n`;
    text += ` */\n`;
    text += `\n`;
    text += `import {ClientConfiguration} from './types';\n`;
    text += `\n`;
    text += `export const client_toml:Partial<ClientConfiguration> = {\n`;
    text += _client_config(client_default);
    text += `};\n`;
    return text;
}
function _client_config(client_default) {
    let text = '';
    const toml_keys = [];
    const toml_read = toml.read(defaults_1.core_config);
    // add keys with client in front
    for (const [conf_key, conf_value] of Object.entries(toml_read)) {
        if (conf_key.indexOf('client_') === 0) {
            const real_key = conf_key.replace('client_', '');
            toml_keys.push(real_key);
            text += `\t${real_key}: ${_real_value(conf_value)},\n`;
            // add "dev_" keys if they are not defined, same as not-"dev_" keys
            if (real_key.indexOf('dev_') === -1 &&
                typeof client_default[`dev_${real_key}`] !== 'undefined' &&
                typeof toml_read[`client_dev_${real_key}`] === 'undefined') {
                toml_keys.push(`dev_${real_key}`);
                text += `\tdev_${real_key}: ${_real_value(conf_value)},\n`;
            }
        }
    }
    // add keys that have same name of the server but they are not defined
    // i.e.: log -> if defined only once it can be used also for the client
    for (const [conf_key, conf_value] of Object.entries(toml_read)) {
        if (!toml_keys.includes(conf_key) &&
            typeof client_default[conf_key] ===
                typeof toml_read[conf_key]) {
            toml_keys.push(conf_key);
            text += `\t${conf_key}: ${_real_value(conf_value)},\n`;
            // set also "dev_" keys if not set
            if (conf_key.indexOf('dev_') === -1 &&
                typeof client_default[`dev_${conf_key}`] !== 'undefined' &&
                typeof toml_read[`dev_${conf_key}`] === 'undefined') {
                toml_keys.push(`dev_${conf_key}`);
                text += `\tdev_${conf_key}: ${_real_value(conf_value)},\n`;
            }
        }
    }
    // add rest of keys from default values
    for (const [conf_key, conf_value] of Object.entries(client_default)) {
        if (toml_keys.includes(conf_key)) {
            continue;
        }
        text += `\t${conf_key}: ${_real_value(conf_value)},\n`;
    }
    return text;
}
function _real_value(value) {
    return uranio_utils_1.urn_util.json.safe_stringify(value);
}
function _generate_uranio_schema_text() {
    const txt = _generate_schema_text();
    // const data = fs.readFileSync(process_params.urn_base_schema, {encoding: 'utf8'});
    // const data = fs.readFileSync(_get_atom_schema_path(), {encoding: 'utf8'});
    const data = _read_schema();
    const data_start = data.split('/** --uranio-generate-start */');
    const data_end = data_start[1].split('/** --uranio-generate-end */');
    let new_data = '';
    new_data += data_start[0];
    new_data += `/** --uranio-generate-start */\n\n`;
    new_data += txt;
    +'\n\n';
    new_data += `/** --uranio-generate-end */`;
    new_data += data_end[1];
    return new_data;
}
function _generate_schema_text() {
    const atom_book = book.get_all_definitions();
    const atom_names = [];
    const auth_names = [];
    const log_names = [];
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        atom_names.push(atom_name);
        if (atom_def.authenticate === true) {
            auth_names.push(atom_name);
        }
        if (atom_def.connection === 'log') {
            log_names.push(atom_name);
        }
    }
    let txt = '';
    txt += _generate_union_names(`AtomName`, atom_names);
    txt += _generate_union_names(`AuthName`, auth_names);
    txt += _generate_union_names(`LogName`, log_names);
    txt += _generate_atom_shapes(atom_book);
    txt += _generate_bond_properties(atom_book);
    txt += _generate_bond_shape_depth(0, atom_book);
    txt += _generate_bond_shape_depth(1, atom_book);
    txt += _generate_bond_shape_depth(2, atom_book);
    txt += _generate_bond_shape_depth(3, atom_book);
    txt += _generate_atom_types(atom_names);
    txt += _generate_atom_shape_type(atom_names);
    txt += _generate_atom_type(atom_names);
    txt += _generate_last_export();
    return txt;
}
/**
 * This syntax is needed in order to make the declaration exports only types
 * with `export` in front.
 * Without this the declaration file will export all the types defined
 * in the module, also the ones without `export`
 */
function _generate_last_export() {
    return '\nexport {};';
}
function _generate_atom_type(atom_names) {
    let text = '';
    text += `export declare type Atom<A extends AtomName> =\n`;
    for (const atom_name of atom_names) {
        text += `\tA extends '${atom_name}' ? ${_atom_type_name(atom_name)} :\n`;
    }
    text += `\tnever\n\n`;
    return text;
}
function _generate_atom_shape_type(atom_names) {
    let text = '';
    text += `export declare type AtomShape<A extends AtomName> =\n`;
    for (const atom_name of atom_names) {
        text += `\tA extends '${atom_name}' ? ${_atom_shape_type_name(atom_name)} :\n`;
    }
    text += `\tnever\n\n`;
    return text;
}
function _atom_type_name(atom_name) {
    return `${uranio_utils_1.urn_util.string.ucfirst(atom_name)}`;
}
function _atom_shape_type_name(atom_name) {
    return `${_atom_type_name(atom_name)}Shape`;
}
function _generate_atom_types(atom_names) {
    let text = '';
    for (const atom_name of atom_names) {
        text += `declare type ${_atom_type_name(atom_name)} =`;
        text += ` AtomHardProperties & ${_atom_shape_type_name(atom_name)}\n\n`;
    }
    return text;
}
function _generate_bond_shape_depth(depth, atom_book) {
    let label = '1';
    let atom_molecule = 'Atom';
    let molecule_depth = '';
    switch (depth) {
        case 0: {
            label = '1';
            atom_molecule = 'Atom';
            molecule_depth = '';
            break;
        }
        case 1: {
            label = '2';
            atom_molecule = 'Molecule';
            molecule_depth = ', 1';
            break;
        }
        case 2: {
            label = '3';
            atom_molecule = 'Molecule';
            molecule_depth = ', 2';
            break;
        }
        case 3: {
            label = '4';
            atom_molecule = 'Molecule';
            molecule_depth = ', 3';
            break;
        }
    }
    let text = '';
    text += `declare type BondShapeDepth${label}<A extends AtomName> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        const bonds = [];
        for (const [key, prop_def] of Object.entries(atom_def.properties)) {
            const optional = (prop_def.optional === true) ? '?' : '';
            if (prop_def.type === types.PropertyType.ATOM) {
                if (typeof prop_def.atom !== 'string' || prop_def.atom === '') {
                    urn_exc.create_invalid_book(`INVALID_PROP_ATOM_NAME`, `Invalid property atom name form property \`key\`.`);
                }
                // TODO check if is valid atom_name
                bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>`);
            }
            else if (prop_def.type === types.PropertyType.ATOM_ARRAY) {
                if (typeof prop_def.atom !== 'string' || prop_def.atom === '') {
                    urn_exc.create_invalid_book(`INVALID_PROP_ATOM_ARRAY__NAME`, `Invalid property atom name form property \`key\`.`);
                }
                bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>[]`);
            }
        }
        const bond_obj = (bonds.length > 0) ? `{${bonds.join(', ')}}` : 'Record<never, unknown>';
        text += `\tA extends '${atom_name}' ? ${bond_obj} :\n`;
    }
    text += `\tnever\n\n`;
    return text;
}
function _generate_bond_properties(atom_book) {
    let text = '';
    text += `declare type BondProperties<A extends AtomName> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        const bond_props = [];
        for (const [key, prop_def] of Object.entries(atom_def.properties)) {
            if (prop_def.type === types.PropertyType.ATOM || prop_def.type === types.PropertyType.ATOM_ARRAY) {
                bond_props.push(key);
            }
        }
        const bond_prop_union = (bond_props.length > 0) ?
            bond_props.map(n => `'${n}'`).join(' | ') : 'never';
        text += `\tA extends '${atom_name}' ? ${bond_prop_union} :\n`;
    }
    text += `\tnever\n\n`;
    return text;
}
function _generate_atom_shapes(atom_book) {
    let text = '';
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        text += `declare type ${_atom_shape_type_name(atom_name)} = AtomCommonProperties & {\n`;
        for (const [key, prop_def] of Object.entries(atom_def.properties)) {
            const optional = (prop_def.optional === true) ? '?' : '';
            switch (prop_def.type) {
                case types.PropertyType.ATOM: {
                    text += `\t${key}${optional}: string\n`;
                    break;
                }
                case types.PropertyType.ATOM_ARRAY: {
                    text += `\t${key}${optional}: string[]\n`;
                    break;
                }
                default: {
                    text += `\t${key}${optional}: ${server_1.real_book_property_type[prop_def.type]}\n`;
                }
            }
        }
        text += `}\n\n`;
    }
    return text;
}
function _generate_union_names(type_name, names) {
    const union = (names.length > 0) ?
        names.map(n => `'${n}'`).join(' | ') : 'never';
    return `export declare type ${type_name} = ${union}\n\n`;
}
//# sourceMappingURL=generate.js.map