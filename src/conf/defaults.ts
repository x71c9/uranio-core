/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {Configuration} from '../typ/conf';

export const core_config:Required<Configuration> = {
	
	db: 'mongo',
	
	encryption_rounds: 12,
	
	// It should be less than 60. 60 are the hashed string.
	max_password_length: 58,
	
	max_query_depth_allowed: 3,
	
	storage: 'aws',
	
	connect_on_init: false,
	
	superuser_create_on_init: false,
	
};
