"use strict";
/**
 * Init module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const defaults_1 = require("../client/defaults");
const atoms_1 = require("../atoms");
const register = __importStar(require("../reg/server"));
const conf = __importStar(require("../conf/client"));
const log = __importStar(require("../log/client"));
function init(config) {
    log.init(urn_lib_1.urn_log.defaults);
    _register_required_atoms();
    if (!config) {
        conf.set_from_env(defaults_1.core_client_config);
    }
    else {
        conf.set(defaults_1.core_client_config, config);
    }
    if (config && typeof config.log_level === 'number') {
        urn_lib_1.urn_log.defaults.log_level = config.log_level;
    }
    conf.set_initialize(true);
}
exports.init = init;
function _register_required_atoms() {
    for (const [atom_name, atom_def] of Object.entries(atoms_1.atom_book)) {
        register.atom(atom_def, atom_name);
    }
}
//# sourceMappingURL=client.js.map