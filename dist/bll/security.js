"use strict";
/**
 * Abstract Class for Business Logic Layer
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
exports.create_security = exports.SecurityBLL = void 0;
const urn_lib_1 = require("urn-lib");
const basic_1 = require("./basic");
let SecurityBLL = class SecurityBLL extends basic_1.BasicBLL {
    constructor(atom_name, user_groups) {
        super(atom_name, user_groups);
    }
};
SecurityBLL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], SecurityBLL);
exports.SecurityBLL = SecurityBLL;
function create_security(atom_name, user_groups) {
    urn_lib_1.urn_log.fn_debug(`Create SecurityBLL [${atom_name}]`);
    return new SecurityBLL(atom_name, user_groups);
}
exports.create_security = create_security;
//# sourceMappingURL=security.js.map