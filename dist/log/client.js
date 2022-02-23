"use strict";
/**
 * Log module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const urn_lib_1 = require("urn-lib");
function init(log_config) {
    /**
     * This "if else" is needed otherwise Typescript will complain
     * the overloads don't match.
     */
    if (typeof log_config === 'number') {
        urn_lib_1.urn_log.init(log_config);
    }
    else {
        urn_lib_1.urn_log.init(log_config);
    }
}
exports.init = init;
//# sourceMappingURL=client.js.map