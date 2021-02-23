/**
 * Index module Business Logic Layer
 *
 * @packageDocumentation
 */

// import * as bll from './bll';

export * from './bll';

import * as auth from './authenticate';

import * as log from './log';

import {create as create_basic} from './basic';

const basic = {create: create_basic};

// const create = bll.create;
// const BLL = bll.BLL;
// const BLLInstance = bll.BLLInstance;

export {
	// create,
	auth,
	log,
	basic,
	// BLL
};
