"use strict";
/**
 * Class for Advanced Data Access Layer
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
exports.create_log = exports.LogDAL = void 0;
const urn_lib_1 = require("urn-lib");
const dal_1 = require("./dal");
let LogDAL = class LogDAL extends dal_1.DAL {
    constructor(log_name) {
        super(log_name);
    }
};
LogDAL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], LogDAL);
exports.LogDAL = LogDAL;
function create_log(log_name) {
    urn_lib_1.urn_log.fn_debug(`Create LogDAL [${log_name}]`);
    return new LogDAL(log_name);
}
exports.create_log = create_log;
//# sourceMappingURL=log.js.map