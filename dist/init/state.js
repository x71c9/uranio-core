"use strict";
/**
 * State module.
 *
 * If the vairable state is different than false, then Uranio has been already
 * initialized.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_and_set_init_state = void 0;
// import {urn_log, urn_exception} from 'uranio-utils';
// const urn_exc = urn_exception.init('INIT_STATE', `Initialization state module`);
const uranio_utils_1 = require("uranio-utils");
let state = false;
function check_and_set_init_state() {
    if (_is_already_initialized()) {
        let err_msg = '[FATAL ERROR]';
        err_msg += `Uranio has been already initialized. `;
        err_msg += `Uranio must be running only once per process.`;
        uranio_utils_1.urn_log.error(err_msg);
        process.exit(1);
    }
    _change_state();
}
exports.check_and_set_init_state = check_and_set_init_state;
function _change_state() {
    state = true;
}
function _is_already_initialized() {
    return state !== false;
}
//# sourceMappingURL=state.js.map