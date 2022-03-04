#!/usr/bin/env node

/**
 * Core generate module
 *
 * @packageDocumentation
 */

import dotenv from 'dotenv';
const result = dotenv.config();

if(result.error){
	throw result.error;
}

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false
});

export * from './register';

import * as uranio from './main';
uranio.init({
	connect_on_init: false,
	superuser_create_on_init: false
});

import * as util from '../util/server';

util.generate.schema_and_save();
