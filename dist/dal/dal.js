"use strict";
/**
 * Default Class for Data Access Layer
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
exports.create = exports.DAL = void 0;
const uranio_utils_1 = require("uranio-utils");
const selfish_1 = require("./selfish");
let DAL = class DAL extends selfish_1.SelfishDAL {
};
DAL = __decorate([
    uranio_utils_1.urn_log.util.decorators.debug_constructor,
    uranio_utils_1.urn_log.util.decorators.debug_methods
], DAL);
exports.DAL = DAL;
function create(atom_name) {
    uranio_utils_1.urn_log.trace(`Create DAL [${atom_name}]`);
    return new DAL(atom_name);
}
exports.create = create;
//# sourceMappingURL=dal.js.map