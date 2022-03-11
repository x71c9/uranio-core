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
	
	dev_log_debug_info: true,
	
	dev_log_color: true,
	
	dev_log_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
	
	dev_log_max_str_length: 174,
	
	dev_log_prefix: '',
	
	dev_log_prefix_type: false,
	
};
