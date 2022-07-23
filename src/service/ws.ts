#!/usr/bin/env node

/**
 * Core binary that will initialized uranio and import delta modules
 *
 * @packageDocumentation
 */

import dotenv from 'dotenv';
const result = dotenv.config();

if(result.error){
	throw result.error;
}

export * from '../server/register';

import uranio from '../server';
uranio.init();

export * from '../server/delta/index';
