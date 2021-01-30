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
exports.create = exports.BLL = void 0;
const urn_lib_1 = require("urn-lib");
const security_1 = require("./security");
let BLL = class BLL extends security_1.SecurityBLL {
};
BLL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], BLL);
exports.BLL = BLL;
function create(atom_name, user_groups) {
    urn_lib_1.urn_log.fn_debug(`Create BLL [${atom_name}]`);
    return new BLL(atom_name, user_groups);
}
exports.create = create;
//# sourceMappingURL=bll.js.map