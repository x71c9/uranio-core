/**
 * Web run module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

import urn_core from './index';

console.log(urn_core.atm);

import client from './client';

console.log(client.types.BookPropertyType.EMAIL);

// const bll_log = urn_core.bll.create_basic('log');
// const bll_log = urn_core.bll.create_log('debug');

// const log = {
//   active: true,
//   msg: 'First log',
//   type: 'debug'
// };

// bll_log.insert_new(log).then((d) => console.log(d));


// bll_log.find({}).then((d) => console.log(d));
