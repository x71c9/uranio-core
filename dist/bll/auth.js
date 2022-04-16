"use strict";
/**
 * Default Class for Business Logic Layer
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
exports.AuthBLL = void 0;
const urn_lib_1 = require("urn-lib");
const atm = __importStar(require("../atm/server"));
const insta = __importStar(require("../nst/server"));
const security_1 = require("./security");
let AuthBLL = class AuthBLL extends security_1.SecurityBLL {
    async insert_new(atom_shape) {
        const atom = await super.insert_new(atom_shape);
        if (!atm.util.is_auth_atom_name(this.atom_name) ||
            !atm.util.is_auth_atom(atom)) {
            return atom;
        }
        const group_bll = insta.get_bll_group();
        const group = await group_bll.insert_new({ name: atom.email });
        atom.groups = [...(atom.groups || []), group._id];
        return await super.update_one(atom);
    }
    async insert_multiple(atom_shapes) {
        const atoms = await super.insert_multiple(atom_shapes);
        if (!atm.util.is_auth_atom_name(this.atom_name) ||
            !atm.util.is_auth_atom(atoms[0])) {
            return atoms;
        }
        const group_bll = insta.get_bll_group();
        const group_shapes = [];
        for (const atom of atoms) {
            group_shapes.push({ name: atom.email });
        }
        const groups = await group_bll.insert_multiple(group_shapes);
        const groups_by_email = {};
        for (const group of groups) {
            groups_by_email[group.name] = group;
        }
        const atoms_with_group = [];
        for (const atom of atoms) {
            const auth_atom = atom;
            auth_atom.groups = [groups_by_email[auth_atom.email]._id];
            const atom_with_group = await super.update_one(auth_atom);
            atoms_with_group.push(atom_with_group);
        }
        return atoms_with_group;
    }
};
AuthBLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], AuthBLL);
exports.AuthBLL = AuthBLL;
//# sourceMappingURL=auth.js.map