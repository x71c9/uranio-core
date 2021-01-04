/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {FullConfiguration} from '../types';

export const core_config:FullConfiguration = {
	
	db_type: 'mongo',
	
	db_host: 'localhost',
	
	db_port: 27017,
	
	db_name: 'uranio_dev',
	
	db_trash_name: 'uranio_trash_dev',
	
	db_log_name: 'uranio_log_dev',
	
	jwt_private_key: 'A_KEY_THAT_NEED_TO_BE_CHANGED',
	
	encryption_round: 12,
	
	max_password_length: 58, // It should be less than 60. 60 are the hashed string.
	
	max_query_depth_allowed: 3
	
};
