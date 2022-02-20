/**
 * TRX generate module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false
});

export * from './register';

import * as util from './util/index';

util.generate.schema_and_save();
