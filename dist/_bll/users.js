"use strict";
/**
 *
 * Implementation of Users Business Logic Layer
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('USER_BLL', 'User Business Logic Layer');
const urn_atms = __importStar(require("../atm/"));
const urn_dals = __importStar(require("../dal/"));
const abstract_1 = require("./abstract");
const defaults_1 = require("../defaults");
let BLLUsers = class BLLUsers extends abstract_1.BLL {
    constructor() {
        super();
    }
    get_dal() {
        return urn_dals.users.create(defaults_1.core_config.db_type);
    }
    create_atom(resource) {
        return urn_atms.user.module.create(resource);
    }
    save_one(resource) {
        const _super = Object.create(null, {
            save_one: { get: () => super.save_one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const user_atom = urn_atms.user.create(resource);
            const saltRounds = 10;
            try {
                const crypt_password = yield bcrypt_1.default.hash(user_atom.password, saltRounds);
                user_atom.password = crypt_password;
            }
            catch (err) {
                const err_msg = `Cannot hash password.`;
                throw urn_exc.create('CANNOT_HASH_PASSWORD', err_msg);
            }
            return _super.save_one.call(this, user_atom);
        });
    }
    authenticate(auth_req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof auth_req !== 'object' || auth_req === null) {
                const user_auth_type = (typeof auth_req === 'object') ? 'null' : typeof auth_req;
                let err_msg = `Invalid request type.`;
                err_msg += ` Request type must be of type "object" - given type [${user_auth_type}].`;
                throw urn_exc.create('AUTH_INVALID_REQUEST_TYPE', err_msg);
            }
            if (!auth_req.email || typeof auth_req.email !== 'string') {
                const err_msg = `Invalid request property email type.`;
                throw urn_exc.create('AUTH_INVALID_EMAIL_TYPE', err_msg);
            }
            if (!auth_req.password || typeof auth_req.password !== 'string') {
                const err_msg = `Invalid request property password type.`;
                throw urn_exc.create('AUTH_INVALID_PASSWORD_TYPE', err_msg);
            }
            if (urn_lib_1.urn_util.is.email(auth_req.email) !== true) {
                const err_msg = `Invalid request property email.`;
                throw urn_exc.create('AUTH_INVALID_EMAIL', err_msg);
            }
            const user_find_one = yield this._dal.find_one({ email: auth_req.email });
            const is_valid_password = yield bcrypt_1.default.compare(auth_req.password, user_find_one.password);
            if (is_valid_password !== true) {
                const err_msg = `Invalid password.`;
                throw urn_exc.create('AUTH_INVALID_PASSWORD', err_msg);
            }
            const token = jsonwebtoken_1.default.sign(user_find_one.get_token_object(), defaults_1.core_config.jwt_private_key);
            return token;
        });
    }
};
BLLUsers = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], BLLUsers);
function create() {
    urn_lib_1.urn_log.fn_debug(`Create BLL Users`);
    return new BLLUsers();
}
exports.create = create;
//# sourceMappingURL=users.js.map