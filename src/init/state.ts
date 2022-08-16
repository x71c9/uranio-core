/**
 * State module.
 *
 * If the vairable state is different than false, then Uranio has been already
 * initialized.
 */

// import {urn_log, urn_exception} from 'urn-lib';

// const urn_exc = urn_exception.init('INIT_STATE', `Initialization state module`);

import {urn_log} from 'urn-lib';

let state = false;

export function check_and_set_init_state(){
	if(_is_already_initialized()){
		let err_msg = '[FATAL ERROR]';
		err_msg += `Uranio has been already initialized. `;
		err_msg += `Uranio must be running only once per process.`;
		urn_log.error(err_msg);
		process.exit(1);
	}
	_change_state();
}

function _change_state(){
	state = true;
}

function _is_already_initialized(){
	return state !== false;
}


