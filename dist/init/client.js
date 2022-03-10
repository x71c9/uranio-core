"use strict";
/**
 * Init module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const urn_lib_1 = require("urn-lib");
const required = __importStar(require("../req/server"));
const register = __importStar(require("../reg/server"));
const conf = __importStar(require("../conf/client"));
const log = __importStar(require("../log/client"));
function init(config, register_required = true) {
    if (config) {
        conf.set(config);
    }
    if (register_required) {
        _register_required_atoms();
    }
    _validate_core_variables();
    _validate_core_book();
    log.init(urn_lib_1.urn_log);
    urn_lib_1.urn_log.debug(`Uranio core client initialization completed.`);
}
exports.init = init;
function _register_required_atoms() {
    const required_atoms = required.get();
    for (const [atom_name, atom_def] of Object.entries(required_atoms)) {
        register.atom(atom_def, atom_name);
    }
}
function _validate_core_variables() {
    // TODO NOTHING TO CHECK YET
}
/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_core_book() {
    // TODO DONE IN SERVER?
}
//# sourceMappingURL=client.js.map