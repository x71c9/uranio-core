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
exports.create = void 0;
const urn_lib_1 = require("urn-lib");
const basic_1 = require("./basic");
let LogBLL = class LogBLL extends basic_1.BasicBLL {
    constructor(log_name) {
        super(log_name);
    }
};
LogBLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], LogBLL);
function create(log_name) {
    urn_lib_1.urn_log.trace(`Create LogBLL [${log_name}]`);
    return new basic_1.BasicBLL(log_name);
}
exports.create = create;
//# sourceMappingURL=log.js.map