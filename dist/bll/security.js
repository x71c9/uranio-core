"use strict";
/**
 * Security Class for Business Logic Layer
 *
 * This is a Business Logic Layer that force the use of a passport in
 * order to initialise.
 *
 * It uses an Access Control Layer (ACL) instead of a Data Access Layer (DAL).
 *
 * If the passport is a superuser it uses a DAL.
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
exports.create_security = exports.SecurityBLL = void 0;
const urn_lib_1 = require("urn-lib");
const conf = __importStar(require("../conf/server"));
const urn_acl = __importStar(require("../acl/server"));
const urn_dal = __importStar(require("../dal/server"));
const basic_1 = require("./basic");
const authenticate_1 = require("./authenticate");
let SecurityBLL = class SecurityBLL extends basic_1.BasicBLL {
    constructor(atom_name, _passport) {
        super(atom_name, _return_acl(atom_name, _passport));
    }
};
SecurityBLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], SecurityBLL);
exports.SecurityBLL = SecurityBLL;
function _return_acl(atom_name, passport) {
    return () => {
        if (conf.get('default_atoms_superuser') === false) {
            return urn_dal.create(atom_name);
        }
        let groups = [];
        // If a Passport is passed and it is a superuser
        // then bypass ACL and return a DAL.
        if (passport) {
            (0, authenticate_1.is_valid_passport)(passport);
            if ((0, authenticate_1.is_superuser)(passport)) {
                return urn_dal.create(atom_name);
            }
            if (Array.isArray(passport.groups)) {
                groups = passport.groups;
            }
        }
        return urn_acl.create(atom_name, groups);
    };
}
function create_security(atom_name, passport) {
    urn_lib_1.urn_log.trace(`Create SecurityBLL [${atom_name}]`);
    return new SecurityBLL(atom_name, passport);
}
exports.create_security = create_security;
//# sourceMappingURL=security.js.map