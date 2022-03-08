/**
 * Module for default client configuration object
 *
 * @packageDocumentation
 */

import {ClientConfiguration} from './types';

export const core_client_config:Required<ClientConfiguration> = {
	
	log_debug_info: true,
	
	log_color: true,
	
	log_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
	
	log_max_str_length: 174,
	
	log_prefix: '',
	
	log_prefix_type: false,
	
	log_dev_debug_info: true,
	
	log_dev_color: true,
	
	log_dev_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
	
	log_dev_max_str_length: 174,
	
	log_dev_prefix: '',
	
	log_dev_prefix_type: false,
	
};
