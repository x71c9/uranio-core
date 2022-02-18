/**
 * TRX generate module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';
urn_log.init(urn_log.LogLevel.FUNCTION_DEBUG);

export * from './register';

import * as util from './util/index';

util.generate.schema_and_save();
