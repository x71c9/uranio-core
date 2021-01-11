"use strict";
/**
 *
 * Implementation of Users Data Access Layer
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
exports.create = void 0;
const urn_lib_1 = require("urn-lib");
const abstract_1 = require("./abstract");
let DALGeneral = class DALGeneral extends abstract_1.DAL {
    constructor(db_type, atom_definition) {
        super(db_type, atom_definition);
    }
};
DALGeneral = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], DALGeneral);
function create(db_type, atom_definition) {
    urn_lib_1.urn_log.fn_debug(`Create DAL General`);
    return new DALGeneral(db_type, atom_definition);
}
exports.create = create;
//# sourceMappingURL=general.js.map