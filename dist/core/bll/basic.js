"use strict";
/**
 * Class for Basic Business Logic Layer
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
exports.create_basic = exports.BasicBLL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_dal = __importStar(require("../dal/"));
const urn_acl = __importStar(require("../acl/"));
let BasicBLL = class BasicBLL {
    constructor(atom_name, user_groups) {
        this.atom_name = atom_name;
        this.user_groups = user_groups;
        if (this.user_groups) {
            this._al = urn_acl.create(this.atom_name, this.user_groups);
        }
        else {
            this._al = urn_dal.create(this.atom_name);
        }
    }
    find(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._al.select(query, options);
        });
    }
    find_by_id(id, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._al.select_by_id(id, depth);
        });
    }
    find_one(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._al.select_one(query, options);
        });
    }
    insert_new(atom_shape) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._al.insert_one(atom_shape);
        });
    }
    update_by_id(id, partial_atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._al.alter_by_id(id, partial_atom);
        });
    }
    update_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update_by_id(atom._id, atom);
        });
    }
    remove_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._al.delete_by_id(id);
        });
    }
    remove_one(molecule) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.remove_by_id(molecule._id);
        });
    }
};
BasicBLL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], BasicBLL);
exports.BasicBLL = BasicBLL;
function create_basic(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create BasicBLL [${atom_name}]`);
    return new BasicBLL(atom_name);
}
exports.create_basic = create_basic;
//# sourceMappingURL=basic.js.map