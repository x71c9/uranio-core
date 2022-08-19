"use strict";
/**
 * Class for Access Control Layer
 *
 * The Access Control Layer is an Access Layer that will check if it is possible
 * to make the query and filters the results with only the accessible data.
 *
 * The permission on each Relation can be UNIFORM or GRANULAR.
 *
 * Default is UNIFORM.
 *
 * UNIFORM permission will check on a Relation level.
 * GRANULAR permission will check on a Record level.
 *
 * In order to the ACL to work, it needs User and Group Relations.
 * Each request is made by an User. Each User has Groups.
 *
 * Each Relation / Record has two attributes _r and _w, respectively for reading
 * and writing permission. The value of these attributes is a Group ID Array.
 *
 * _r will narrow from Everybody
 * _w will widen from Nobody
 *
 * _r == nullish -> Everybody can read
 * _w == nullish -> Nobody can write
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
exports.create = exports.ACL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('ACL', 'Access Control Module');
const conf = __importStar(require("../conf/server"));
const urn_dal = __importStar(require("../dal/server"));
const atm_keys = __importStar(require("../atm/keys"));
const atm_util = __importStar(require("../atm/util"));
const book_1 = require("../typ/book");
const auth_1 = require("../typ/auth");
const book = __importStar(require("../book/server"));
const index_1 = require("../layer/index");
let ACL = class ACL {
    constructor(atom_name, user_groups) {
        this.atom_name = atom_name;
        this.user_groups = user_groups;
        if (conf.get('default_atoms_superuser') === false) {
            throw urn_exc.create_not_initialized('SUPERUSER_MUST_BE_DEFINED', 'Atom _superuser must be defined in order to initialize an ACL.' +
                'Set `default_atoms_superuser = true` in `uranio.toml`');
        }
        this._dal = urn_dal.create(atom_name);
        const atom_def = book.get_definition(atom_name);
        const security = atom_def['security'];
        this._security_type = book_1.SecurityType.UNIFORM;
        this._read = undefined;
        this._write = undefined;
        if (security) {
            if (typeof security === 'string') {
                if (security === book_1.SecurityType.GRANULAR) {
                    this._security_type = security;
                }
            }
            else {
                this._read = security._r;
                this._write = security._w;
            }
        }
        this._read_query = { $or: [{ _r: { $exists: 0 } }, { _r: { $in: user_groups } }] };
    }
    is_valid_id(_id) {
        return this._dal.is_valid_id(_id);
    }
    _can_uniform_read() {
        if (this._security_type === book_1.SecurityType.UNIFORM) {
            if (this._read === book_1.PermissionType.NOBODY || (this._read && !this.user_groups.includes(this._read))) {
                throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Read unauthorized');
            }
        }
    }
    _can_uniform_write() {
        if (this._security_type === book_1.SecurityType.UNIFORM) {
            if (this._write !== book_1.PermissionType.PUBLIC && (!this._write || !this.user_groups.includes(this._write))) {
                throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
            }
        }
    }
    async _can_atom_write(id) {
        const atom = await this._dal.select_by_id(id);
        if (!atom._w || !this.user_groups.includes(atom._w)) {
            throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
        }
        return true;
    }
    async _can_atom_write_multiple(ids) {
        const atoms = await this._dal.select({ _id: { $in: ids } });
        for (const atom of atoms) {
            if (!atom._w || !this.user_groups.includes(atom._w)) {
                throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
            }
        }
        return true;
    }
    filter_uniform_bond_properties(molecule, depth = 0) {
        const bond_keys = atm_keys.get_bond(this.atom_name);
        for (const k of bond_keys) {
            const subatom_name = atm_util.get_subatom_name(this.atom_name, k);
            const acl = create(subatom_name, this.user_groups);
            try {
                acl._can_uniform_read();
                if (depth) {
                    const prop_value = molecule[k];
                    if (Array.isArray(prop_value)) {
                        for (let subatom of prop_value) {
                            subatom = acl.filter_uniform_bond_properties(subatom, depth - 1);
                        }
                    }
                    else {
                        // molecule[k] = acl.filter_uniform_bond_properties(molecule[k] as schema.Molecule<A,D>, depth - 1) as any;
                        molecule[k] = acl.filter_uniform_bond_properties(molecule[k], depth - 1);
                    }
                }
            }
            catch (e) {
                const err = e;
                if (err.type === urn_lib_1.urn_exception.ExceptionType.UNAUTHORIZED) {
                    // molecule[k] = (Array.isArray(molecule[k])) ? [] : '' as any;
                    delete molecule[k];
                }
                else {
                    throw err;
                }
            }
        }
        return molecule;
    }
    async select(query, options) {
        this._can_uniform_read();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            query = { $and: [query, this._read_query] };
            if (!options) {
                options = {};
            }
            // options.depth_query = query;
            options.depth_query = this._read_query;
        }
        const molecules = await this._dal.select(query, options);
        return molecules.map((m) => {
            const depth = (options) ? options.depth : 0;
            return this.filter_uniform_bond_properties(m, depth);
        });
    }
    async select_by_id(id, options) {
        this._can_uniform_read();
        let query = { _id: id };
        if (options && this._security_type === book_1.SecurityType.GRANULAR) {
            query = { $and: [query, this._read_query] };
            // options.depth_query = query;
            options.depth_query = this._read_query;
        }
        return await this._dal.select_one(query, options);
    }
    async select_one(query, options) {
        this._can_uniform_read();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            query = { $and: [query, this._read_query] };
            if (!options) {
                options = {};
            }
            // options.depth_query = query;
            options.depth_query = this._read_query;
        }
        return await this._dal.select_one(query, options);
    }
    async count(query) {
        this._can_uniform_read();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            query = { $and: [query, this._read_query] };
        }
        return await this._dal.count(query);
    }
    async insert_one(atom_shape) {
        this._can_uniform_write();
        return await this._dal.insert_one(atom_shape);
    }
    async alter_by_id(id, partial_atom, options) {
        this._can_uniform_write();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            this._can_atom_write(id);
        }
        return await this._dal.alter_by_id(id, partial_atom, options);
    }
    async delete_by_id(id) {
        this._can_uniform_write();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            this._can_atom_write(id);
        }
        const acl_res = await this._dal.delete_by_id(id);
        return acl_res;
    }
    async authorize(action, id) {
        if (action === auth_1.AuthAction.READ) {
            this._can_uniform_read();
        }
        else if (action === auth_1.AuthAction.WRITE) {
            this._can_uniform_write();
            if (typeof id !== 'undefined' && this._security_type === book_1.SecurityType.GRANULAR) {
                this._can_atom_write(id);
            }
        }
        return true;
    }
    async select_multiple(ids, options) {
        this._can_uniform_read();
        let query = { _id: { $in: ids } };
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            query = { $and: [query, this._read_query] };
            if (!options) {
                options = {};
            }
            // options.depth_query = query;
            options.depth_query = this._read_query;
        }
        const molecules = await this._dal.select(query, options);
        return molecules.map((m) => {
            const depth = (options) ? options.depth : 0;
            return this.filter_uniform_bond_properties(m, depth);
        });
    }
    async alter_multiple(ids, partial_atom) {
        this._can_uniform_write();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            this._can_atom_write_multiple(ids);
        }
        return await this._dal.alter_multiple(ids, partial_atom);
    }
    async insert_multiple(atom_shapes) {
        this._can_uniform_write();
        return await this._dal.insert_multiple(atom_shapes);
    }
    async delete_multiple(ids) {
        this._can_uniform_write();
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            this._can_atom_write_multiple(ids);
        }
        const acl_res = await this._dal.delete_multiple(ids);
        return acl_res;
    }
    async search(string, options) {
        this._can_uniform_read();
        let search_object = (0, index_1.search_query_object)(string, this.atom_name);
        if (this._security_type === book_1.SecurityType.GRANULAR) {
            search_object = { $and: [this._read_query, search_object] };
            if (!options) {
                options = {};
            }
            // options.depth_query = query;
            options.depth_query = this._read_query;
        }
        return await this.select(search_object, options);
    }
    async search_count(string) {
        const search_object = (0, index_1.search_query_object)(string, this.atom_name);
        return await this.count(search_object);
    }
};
ACL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], ACL);
exports.ACL = ACL;
function create(atom_name, user_groups) {
    urn_lib_1.urn_log.trace(`Create ACL [${atom_name}]`, user_groups);
    return new ACL(atom_name, user_groups);
}
exports.create = create;
//# sourceMappingURL=acl.js.map