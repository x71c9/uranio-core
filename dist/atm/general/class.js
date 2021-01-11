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
exports.General = void 0;
const urn_lib_1 = require("urn-lib");
const abstract_1 = require("../abstract");
/**
 * Class for Atom General
 */
let General = class General extends abstract_1.Atom {
    constructor(atom_name, resource) {
        super(resource);
        this.atom_name = atom_name;
    }
    get_keys() {
        return user_keys;
    }
};
__decorate([
    urn_lib_1.urn_log.decorators.no_debug
], General.prototype, "get_keys", null);
General = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], General);
exports.General = General;
//# sourceMappingURL=class.js.map