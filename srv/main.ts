/**
 * Main module for server
 *
 * @packageDocumentation
 */

import * as types from './types';

export {types};


import * as bll from '../bll/';

export {bll};


import * as atm from '../atm/';

export {atm};


import * as book from '../book/';

export {book};


import * as stc from '../stc/';

export {stc};


export * from '../cnn/';


import {core_config} from '../cnf/defaults';

export function init(config:types.Configuration)
		:void{
	Object.assign(core_config, config);
}
