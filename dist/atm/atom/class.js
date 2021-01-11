"use strict";
/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.user_keys = void 0;
const urn_lib_1 = require("urn-lib");
const abstract_1 = require("../abstract");
const types_1 = require("../types");
const urn_exc = urn_lib_1.urn_exception.init('ATM-USER', `Atom User Module`);
exports.user_keys = types_1.models.user.keys;
/**
 * Class for Atom User
 */
let User = class User extends abstract_1.Atom {
    constructor(user) {
        super(user);
        this.email = user.email;
        this.username = user.username;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.type = user.type;
        this.active = user.active;
        this.password = user.password;
    }
    get_keys() {
        return exports.user_keys;
    }
    get name() {
        return `${this.first_name} ${this.last_name}`;
    }
    get_token_object() {
        if (!this._id) {
            const err_msg = `Cannot generate token object. Atom User has no _id.`;
            throw urn_exc.create('GET_TOKEN_OBJ_USER_NO_ID', err_msg);
        }
        return {
            _id: this._id,
            name: this.name
        };
    }
};
__decorate([
    urn_lib_1.urn_log.decorators.no_debug
], User.prototype, "get_keys", null);
User = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], User);
exports.User = User;
//# sourceMappingURL=class.js.map