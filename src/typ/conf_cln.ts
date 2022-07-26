/**
 * Client Conf type module
 *
 * @packageDocumentation
 */

type RequiredClientConfigParams = {
}

type OptionalClientConfigParam = {
	
	default_atoms_superuser: boolean
	
	default_atoms_group: boolean
	
	default_atoms_user: boolean
	
	default_atoms_media: boolean
	
	log_debug_info: boolean
	
	log_color: boolean
	
	log_time_format: string
	
	log_max_str_length: number
	
	log_prefix: string
	
	log_prefix_type: boolean
	
	dev_log_debug_info: boolean
	
	dev_log_color: boolean
	
	dev_log_time_format: string
	
	dev_log_max_str_length: number
	
	dev_log_prefix: string
	
	dev_log_prefix_type: boolean
	
}

export type ClientConfiguration =
	RequiredClientConfigParams &
	Partial<OptionalClientConfigParam>;
