/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {Configuration} from './types';

export const core_default_config:Configuration = {
	
	db_type: 'mongo',
	
	db_host: 'localhost',
	
	db_port: 27017,
	
	db_name: 'uranio_dev',
	
	db_trash_name: 'uranio_trash_dev',
	
	db_log_name: 'uranio_log_dev',
	
	log_level: 1
	
};
