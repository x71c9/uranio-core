"use strict";
/**
 * Generate module
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
exports.generate = void 0;
const fs_1 = __importDefault(require("fs"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`REGISTER_MODULE`, `Register module.`);
const index_1 = require("../stc/index");
const book = __importStar(require("../book/index"));
const types = __importStar(require("../types"));
let urn_generate_base_schema = `./types/schema.d.ts`;
let urn_generate_output_dir = `.`;
function generate() {
    urn_lib_1.urn_log.debug('Generating uranio schema...');
    const text = _generate_schema_text();
    _save_schema_declaration_file(text);
    urn_lib_1.urn_log.debug(`Schema generated.`);
}
exports.generate = generate;
function _save_schema_declaration_file(text) {
    for (const argv of process.argv) {
        const splitted = argv.split('=');
        if (splitted[0] === 'urn_generate_base_schema'
            && typeof splitted[1] === 'string'
            && splitted[1] !== '') {
            urn_generate_base_schema = splitted[1];
        }
        else if (splitted[0] === 'urn_generate_output_dir'
            && typeof splitted[1] === 'string'
            && splitted[1] !== '') {
            urn_generate_output_dir = splitted[1];
        }
    }
    _replace_text(urn_generate_base_schema, urn_generate_output_dir, text);
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
    return '\n\texport {};';
}
function _replace_text(base_schema_path, output_dir_path, txt) {
    const data = fs_1.default.readFileSync(base_schema_path, { encoding: 'utf8' });
    const data_start = data.split('/** --uranio-generate-start */');
    const data_end = data_start[1].split('/** --uranio-generate-end */');
    let new_data = '';
    new_data += data_start[0];
    new_data += `/** --uranio-generate-start */\n\n`;
    new_data += txt;
    +'\n\n';
    new_data += `/** --uranio-generate-end */`;
    new_data += data_end[1];
    fs_1.default.writeFileSync(`${output_dir_path}/schema.d.ts`, new_data);
}
function _generate_atom_type(atom_names) {
    let text = '';
    text += `\texport type Atom<A extends AtomName> =\n`;
    for (const atom_name of atom_names) {
        text += `\t\tA extends '${atom_name}' ? ${_atom_type_name(atom_name)} :\n`;
    }
    text += `\t\tnever\n\n`;
    return text;
}
function _generate_atom_shape_type(atom_names) {
    let text = '';
    text += `\texport type AtomShape<A extends AtomName> =\n`;
    for (const atom_name of atom_names) {
        text += `\t\tA extends '${atom_name}' ? ${_atom_shape_type_name(atom_name)} :\n`;
    }
    text += `\t\tnever\n\n`;
    return text;
}
function _atom_type_name(atom_name) {
    return `${urn_lib_1.urn_util.string.ucfirst(atom_name)}`;
}
function _atom_shape_type_name(atom_name) {
    return `${_atom_type_name(atom_name)}Shape`;
}
function _generate_atom_types(atom_names) {
    let text = '';
    for (const atom_name of atom_names) {
        text += `\ttype ${_atom_type_name(atom_name)} =`;
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
    text += `\ttype BondShapeDepth${label}<A extends AtomName> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        const bonds = [];
        for (const [key, prop_def] of Object.entries(atom_def.properties)) {
            const optional = (prop_def.optional === true) ? '?' : '';
            if (prop_def.type === types.BookProperty.ATOM) {
                if (typeof prop_def.atom !== 'string' || prop_def.atom === '') {
                    urn_exc.create_invalid_book(`INVALID_PROP_ATOM_NAME`, `Invalid property atom name form property \`key\`.`);
                }
                // TODO check if is valid atom_name
                bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>`);
            }
            else if (prop_def.type === types.BookProperty.ATOM_ARRAY) {
                if (typeof prop_def.atom !== 'string' || prop_def.atom === '') {
                    urn_exc.create_invalid_book(`INVALID_PROP_ATOM_ARRAY__NAME`, `Invalid property atom name form property \`key\`.`);
                }
                bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>[]`);
            }
        }
        const bond_obj = (bonds.length > 0) ? `{${bonds.join(', ')}}` : 'never';
        text += `\t\tA extends '${atom_name}' ? ${bond_obj} :\n`;
    }
    text += `\t\tnever\n\n`;
    return text;
}
function _generate_bond_properties(atom_book) {
    let text = '';
    text += `\ttype BondProperties<A extends AtomName> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        const bond_props = [];
        for (const [key, prop_def] of Object.entries(atom_def.properties)) {
            if (prop_def.type === types.BookProperty.ATOM || prop_def.type === types.BookProperty.ATOM_ARRAY) {
                bond_props.push(key);
            }
        }
        const bond_prop_union = (bond_props.length > 0) ?
            bond_props.map(n => `'${n}'`).join(' | ') : 'never';
        text += `\t\tA extends '${atom_name}' ? ${bond_prop_union} :\n`;
    }
    text += `\t\tnever\n\n`;
    return text;
}
function _generate_atom_shapes(atom_book) {
    let text = '';
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        text += `\ttype ${_atom_shape_type_name(atom_name)} = AtomCommonProperties & {\n`;
        for (const [key, prop_def] of Object.entries(atom_def.properties)) {
            const optional = (prop_def.optional === true) ? '?' : '';
            switch (prop_def.type) {
                case types.BookProperty.ATOM: {
                    text += `\t\t${key}${optional}: string\n`;
                    break;
                }
                case types.BookProperty.ATOM_ARRAY: {
                    text += `\t\t${key}${optional}: string[]\n`;
                    break;
                }
                default: {
                    text += `\t\t${key}${optional}: ${index_1.real_book_property_type[prop_def.type]}\n`;
                }
            }
        }
        text += `\t}\n\n`;
    }
    return text;
}
function _generate_union_names(type_name, names) {
    const union = (names.length > 0) ?
        names.map(n => `'${n}'`).join(' | ') : 'never';
    return `\texport type ${type_name} = ${union}\n\n`;
}
//# sourceMappingURL=generate.js.map