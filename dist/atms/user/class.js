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
const atom_1 = require("../atom");
const types_1 = require("../types");
exports.user_keys = types_1.models.user.keys;
/**
 * Class for Atom User
 */
let User = class User extends atom_1.Atom {
    constructor(user) {
        super(user);
        this.email = user.email;
        this.username = user.username;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.type = user.type;
        this.active = user.active;
        this.bio = user.bio;
        this.password = user.password;
        this.creation_date = user.creation_date;
    }
    _get_keys() {
        return exports.user_keys;
    }
};
User = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], User);
exports.User = User;
//# sourceMappingURL=class.js.map