/**
 * Web run module
 *
 * @packageDocumentation
 */
import {urn_log} from 'urn-lib';
urn_log.init(urn_log.LogLevel.FUNCTION_DEBUG);

import uranio from './server';
uranio.init();

