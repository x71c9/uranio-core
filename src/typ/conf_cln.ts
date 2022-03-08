/**
 * Client Conf type module
 *
 * @packageDocumentation
 */

type RequiredClientConfigParams = {
}

type OptionalClientConfigParam = {
	
	log_debug_info: boolean
	
	log_color: boolean
	
	log_time_format: string
	
	log_max_str_length: number
	
	log_prefix: string
	
	log_prefix_type: boolean
	
	log_dev_debug_info: boolean
	
	log_dev_color: boolean
	
	log_dev_time_format: string
	
	log_dev_max_str_length: number
	
	log_dev_prefix: string
	
	log_dev_prefix_type: boolean
	
}

export type ClientConfiguration =
	RequiredClientConfigParams &
	Partial<OptionalClientConfigParam>;
