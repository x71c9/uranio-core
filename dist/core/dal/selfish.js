"use strict";
/**
 * Class for Selfish/Autofix Data Access Layer
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_selfish = exports.SelfishDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_atm = __importStar(require("../atm/"));
const recycle_1 = require("./recycle");
let SelfishDAL = class SelfishDAL extends recycle_1.RecycleDAL {
    _replace_atom_on_error(id, atom) {
        return __awaiter(this, void 0, void 0, function* () {
            atom = yield this._encrypt_changed_properties(id, atom);
            atom = yield this._fix_atom_on_validation_error(atom);
            const db_res_insert = yield this._db_relation.replace_by_id(id, atom);
            urn_atm.validate_atom(this.atom_name, db_res_insert);
            return db_res_insert;
        });
    }
    _replace_molecule_on_error(id, molecule, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            const atom = urn_atm.molecule_to_atom(this.atom_name, molecule);
            yield this._replace_atom_on_error(id, atom);
            return yield this.select_by_id(id, depth);
        });
    }
    _fix_molecule_on_validation_error(molecule, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            const bond_keys = urn_atm.get_bond_keys(this.atom_name);
            if (!depth || (urn_atm.is_atom(this.atom_name, molecule) && bond_keys.size === 0)) {
                return (yield this._fix_atom_on_validation_error(molecule));
            }
            else {
                for (const k of bond_keys) {
                    const bond_name = urn_atm.get_subatom_name(this.atom_name, k);
                    let prop_value = molecule[k];
                    const SUBDAL = create_selfish(bond_name);
                    if (Array.isArray(prop_value)) {
                        for (let i = 0; i < prop_value.length; i++) {
                            let subatom = prop_value[i];
                            subatom =
                                yield SUBDAL._fix_molecule_on_validation_error(subatom, depth - 1);
                        }
                    }
                    else {
                        prop_value =
                            yield SUBDAL._fix_molecule_on_validation_error(prop_value, depth - 1);
                    }
                }
            }
            try {
                urn_atm.validate_molecule_primitive_properties(this.atom_name, molecule);
            }
            catch (exc) {
                if (exc.type !== "INVALID" /* INVALID */) {
                    throw exc;
                }
                if (this.trash_dal) {
                    const clone_molecule = Object.assign({}, molecule);
                    clone_molecule._deleted_from = molecule._id;
                    yield this.trash_dal.insert_one(clone_molecule);
                }
                let k;
                for (k of exc.keys) {
                    if (molecule[k] && !urn_atm.is_valid_property(this.atom_name, k)) {
                        delete molecule[k];
                    }
                    else {
                        molecule = urn_atm.fix_property(this.atom_name, molecule, k);
                    }
                }
                molecule = yield this._replace_molecule_on_error(molecule._id, molecule, depth);
            }
            return molecule;
        });
    }
    _fix_atom_on_validation_error(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                urn_atm.validate_atom(this.atom_name, atom);
            }
            catch (exc) {
                if (exc.type !== "INVALID" /* INVALID */) {
                    throw exc;
                }
                if (this.trash_dal) {
                    const clone_atom = Object.assign({}, atom);
                    clone_atom._deleted_from = clone_atom._id;
                    yield this.trash_dal.insert_one(clone_atom);
                }
                let k;
                for (k of exc.keys) {
                    if (atom[k] && !urn_atm.is_valid_property(this.atom_name, k)) {
                        delete atom[k];
                    }
                    else {
                        atom = urn_atm.fix_property(this.atom_name, atom, k);
                    }
                }
                atom = yield this._replace_atom_on_error(atom._id, atom);
            }
            return atom;
        });
    }
    validate(molecule, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._fix_molecule_on_validation_error(molecule, depth);
        });
    }
};
SelfishDAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], SelfishDAL);
exports.SelfishDAL = SelfishDAL;
function create_selfish(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create SelfishDAL [${atom_name}]`);
    return new SelfishDAL(atom_name);
}
exports.create_selfish = create_selfish;
//# sourceMappingURL=selfish.js.map