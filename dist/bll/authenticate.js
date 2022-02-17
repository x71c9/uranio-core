"use strict";
/**
 * Class for Authentication Business Logic Layer
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_superuser = exports.is_valid_passport = exports.is_public_request = exports.create = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('AUTHENTICATION_BLL', 'Authentication BLL');
const conf = __importStar(require("../conf/index"));
const book_srv_1 = require("../typ/book_srv");
const index_1 = require("../stc/index");
const auth_1 = require("../typ/auth");
const atm_validate = __importStar(require("../atm/validate"));
const atm_util = __importStar(require("../atm/util"));
const book = __importStar(require("../book/index"));
const basic_1 = require("./basic");
let AuthenticationBLL = class AuthenticationBLL {
    constructor(_atom_name) {
        this._atom_name = _atom_name;
        this._basic_bll = (0, basic_1.create)(this._atom_name);
    }
    async get_passport(token) {
        const decoded_token = jsonwebtoken_1.default.verify(token, conf.get(`jwt_private_key`));
        return decoded_token;
    }
    async authenticate(email, password) {
        atm_validate.atom_partial(this._atom_name, { email: email, password: password });
        let auth_atom;
        try {
            auth_atom = await this._basic_bll.find_one({ email: email });
        }
        catch (e) {
            const err = e;
            if (err.type === urn_lib_1.urn_exception.ExceptionType.NOT_FOUND) {
                throw urn_exc.create_auth_not_found(err.error_code, err.msg, err);
            }
            throw err;
        }
        if (!atm_util.is_auth_atom(auth_atom)) {
            throw urn_exc.create_invalid_atom('INVALID_AUTH_ATOM', 'Invalid Auth schema.Atom.', auth_atom, ['email', 'password', 'groups']);
        }
        const compare_result = await bcryptjs_1.default.compare(password, auth_atom.password);
        if (!compare_result) {
            throw urn_exc.create_auth_invalid_password('AUTH_INVALID_PASSWORD', `Invalid password.`);
        }
        return this._generate_token(auth_atom);
    }
    _generate_passport(auth_atom) {
        return {
            _id: auth_atom._id,
            auth_atom_name: this._atom_name,
            groups: auth_atom.groups || []
        };
    }
    _generate_token(auth_atom) {
        const passport = this._generate_passport(auth_atom);
        return jsonwebtoken_1.default.sign(passport, conf.get(`jwt_private_key`));
    }
};
AuthenticationBLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], AuthenticationBLL);
function create(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create AuthenticationBLL [${atom_name}]`);
    return new AuthenticationBLL(atom_name);
}
exports.create = create;
function is_public_request(atom_name, action) {
    const atom_def = book.get_definition(atom_name);
    if (action === auth_1.AuthAction.READ) {
        if (!atom_def.security ||
            atom_def.security === book_srv_1.BookSecurity.UNIFORM) {
            return true;
        }
        if (typeof atom_def.security === 'object' &&
            atom_def.security.type === book_srv_1.BookSecurity.UNIFORM &&
            atom_def.security._r === undefined) {
            return true;
        }
        return false;
    }
    else if (action === auth_1.AuthAction.WRITE) {
        if (typeof atom_def.security === 'object' &&
            atom_def.security.type === book_srv_1.BookSecurity.UNIFORM &&
            atom_def.security._w === book_srv_1.BookPermission.PUBLIC) {
            return true;
        }
        return false;
    }
    return false;
}
exports.is_public_request = is_public_request;
function is_valid_passport(passport) {
    // _token_is_object(passport);
    passport_has_all_keys(passport);
    passport_has_no_other_keys(passport);
    passport_has_correct_type_values(passport);
    // await _if_superuser_validate_id(passport);
    return true;
}
exports.is_valid_passport = is_valid_passport;
// function _token_is_object(passport:Passport)
//   :true{
//   if(!passport){
//     throw urn_exc.create_invalid_request('TOKEN_UNDEFINED', 'Token is missing.');
//   }
//   if(typeof passport !== 'object'){
//     throw urn_exc.create_invalid_request('TOKEN_INVALID_TYPE', 'Token has wrong type.');
//   }
//   return true;
// }
function passport_has_all_keys(passport) {
    for (const k in index_1.abstract_passport) {
        if (!urn_lib_1.urn_util.object.has_key(passport, k)) {
            throw urn_exc.create_invalid_request('PASSPORT_MISSING_KEY', `Passport is missing key \`${k}\`.`);
        }
    }
    return true;
}
function passport_has_no_other_keys(passport) {
    for (const [k] of Object.entries(passport)) {
        if (k === 'iat') {
            continue;
        }
        if (!urn_lib_1.urn_util.object.has_key(index_1.abstract_passport, k)) {
            throw urn_exc.create_invalid_request('PASSPORT_INVALID_KEY', `Passport have invalid keys \`${k}\`.`);
        }
    }
    return true;
}
function passport_has_correct_type_values(passport) {
    let k;
    for (k in index_1.abstract_passport) {
        _check_passport_key_type(passport, k);
    }
    return true;
}
function _check_passport_key_type(passport, key) {
    switch (index_1.abstract_passport[key]) {
        case 'string': {
            if (typeof passport[key] !== 'string') {
                const err_msg = 'Invalid passport.';
                throw urn_exc.create_invalid_request('PASSPORT_INVALID_VALUE_TYPE', err_msg);
            }
            return true;
        }
        case 'string[]': {
            if (!Array.isArray(passport[key])) {
                const err_msg = 'Invalid passport.';
                throw urn_exc.create_invalid_request('PASSPORT_INVALID_VALUE_TYPE', err_msg);
            }
            return true;
        }
    }
}
function is_superuser(passport) {
    if (passport &&
        typeof passport === 'object' &&
        passport.auth_atom_name === 'superuser') {
        return true;
    }
    return false;
}
exports.is_superuser = is_superuser;
// async function _if_superuser_validate_id(passport:Passport)
//     :Promise<true>{
//   if(passport.auth_atom_name !== 'superuser'){
//     return true;
//   }
//   return true;
//   // try{
//   //   const basic_superusers_bll = create_basic('superuser');
//   //   await basic_superusers_bll.find_by_id(passport._id);
//   //   return true;
//   // }catch(ex){
//   //   const err_msg = 'Invalid passport object _id.';
//   //   throw urn_exc.create_invalid_request('INVALID_TOKEN_SU_ID', err_msg);
//   // }
// }
//# sourceMappingURL=authenticate.js.map