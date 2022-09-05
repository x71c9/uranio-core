"use strict";
/**
 * Class for Selfish Data Access Layer
 *
 * This class will autofix Atoms when retrieving them from the db.
 * If a property of an schema.Atom is invalid the class will try to replace with a
 * function return value or a default value defined in `atom_book`.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_selfish = exports.SelfishDAL = void 0;
const uranio_utils_1 = require("uranio-utils");
const atm_validate = __importStar(require("../atm/validate"));
const atm_util = __importStar(require("../atm/util"));
const atm_keys = __importStar(require("../atm/keys"));
const atm_fix = __importStar(require("../atm/fix"));
const recycle_1 = require("./recycle");
let SelfishDAL = class SelfishDAL extends recycle_1.RecycleDAL {
    async _replace_atom_on_error(id, atom) {
        atom = await this._encrypt_changed_properties(id, atom);
        atom = await this._fix_atom_on_validation_error(atom);
        const db_res_insert = await this._db_relation.replace_by_id(id, atom);
        atm_validate.atom(this.atom_name, db_res_insert);
        return db_res_insert;
    }
    async _replace_molecule_on_error(id, molecule, depth) {
        const atom = atm_util.molecule_to_atom(this.atom_name, molecule);
        await this._replace_atom_on_error(id, atom);
        return await this.select_by_id(id, { depth: depth });
    }
    async _fix_molecule_on_validation_error(molecule, depth) {
        const bond_keys = atm_keys.get_bond(this.atom_name);
        const optional_keys = atm_keys.get_optional(this.atom_name);
        if (!depth || (atm_util.is_atom(this.atom_name, molecule) && bond_keys.size === 0)) {
            return (await this._fix_atom_on_validation_error(molecule));
        }
        else {
            for (const k of bond_keys) {
                if (optional_keys.has(k) && typeof molecule[k] === 'undefined') {
                    continue;
                }
                const bond_name = atm_util.get_subatom_name(this.atom_name, k);
                const prop_value = molecule[k];
                const SUB_DAL = create_selfish(bond_name);
                const sub_depth = depth - 1;
                if (Array.isArray(prop_value)) {
                    for (let i = 0; i < prop_value.length; i++) {
                        const subatom = prop_value[i];
                        prop_value[i] = await SUB_DAL._fix_molecule_on_validation_error(subatom, sub_depth);
                    }
                }
                else {
                    molecule[k] = await SUB_DAL._fix_molecule_on_validation_error(prop_value, sub_depth);
                }
            }
        }
        try {
            atm_validate.molecule_primitive_properties(this.atom_name, molecule);
        }
        catch (e) {
            const exc = e;
            if (exc.type !== uranio_utils_1.urn_exception.ExceptionType.INVALID_ATOM) {
                throw exc;
            }
            if (this.trash_dal) {
                const clone_molecule = uranio_utils_1.urn_util.object.deep_clone(molecule);
                clone_molecule._from = molecule._id;
                await this.trash_dal.insert_one(clone_molecule);
            }
            let k;
            for (k of exc.keys) {
                if (uranio_utils_1.urn_util.object.has_key(molecule, k) && !atm_util.has_property(this.atom_name, k)) {
                    delete molecule[k];
                }
                else {
                    molecule = atm_fix.property(this.atom_name, molecule, k);
                }
            }
            molecule = await this._replace_molecule_on_error(molecule._id, molecule, depth);
        }
        return molecule;
    }
    async _fix_atom_on_validation_error(atom) {
        try {
            atm_validate.atom(this.atom_name, atom);
        }
        catch (e) {
            const exc = e;
            if (exc.type !== uranio_utils_1.urn_exception.ExceptionType.INVALID_ATOM) {
                throw exc;
            }
            if (this.trash_dal) {
                const clone_atom = uranio_utils_1.urn_util.object.deep_clone(atom);
                clone_atom._from = clone_atom._id;
                await this.trash_dal.insert_one(clone_atom);
            }
            let k;
            for (k of exc.keys) {
                if (uranio_utils_1.urn_util.object.has_key(atom, k) && !atm_util.has_property(this.atom_name, k)) {
                    delete atom[k];
                }
                else {
                    atom = atm_fix.property(this.atom_name, atom, k);
                }
            }
            atom = await this._replace_atom_on_error(atom._id, atom);
        }
        return atom;
    }
    async validate(molecule, depth) {
        return await this._fix_molecule_on_validation_error(molecule, depth);
    }
};
SelfishDAL = __decorate([
    uranio_utils_1.urn_log.util.decorators.debug_constructor,
    uranio_utils_1.urn_log.util.decorators.debug_methods
], SelfishDAL);
exports.SelfishDAL = SelfishDAL;
function create_selfish(atom_name) {
    uranio_utils_1.urn_log.trace(`Create SelfishDAL [${atom_name}]`);
    return new SelfishDAL(atom_name);
}
exports.create_selfish = create_selfish;
//# sourceMappingURL=selfish.js.map