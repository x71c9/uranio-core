/**
 * Module for default client configuration object
 * Uranio `generate` script will replace this file with the client part
 * of the uranio.toml configration file.
 *
 * All properties starting with `client_` will populate this object.
 *
 * @packageDocumentation
 */

import {ClientConfiguration} from './types';

export const client_toml:Partial<ClientConfiguration> = {
	log_debug_info: false,
	log_color: true,
	log_time_format: "HH:MM:ss:l",
	log_max_str_length: 174,
	log_prefix: "",
	log_prefix_type: false,
	dev_log_debug_info: false,
	dev_log_color: true,
	dev_log_time_format: "yyyy-mm-dd'T'HH:MM:ss:l",
	dev_log_max_str_length: 174,
	dev_log_prefix: "",
	dev_log_prefix_type: false,
	default_atoms_superuser: true,
	default_atoms_group: true,
	default_atoms_user: false,
	default_atoms_media: false,
};
