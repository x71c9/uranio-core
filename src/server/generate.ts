/**
 * Core generate module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false
});

import * as util from '../util/server';

util.generate.schema_and_save();
