/**
 * Module for default client configuration object
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {ClientConfiguration} from './types';

/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-core/conf/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
export const core_client_config:Required<ClientConfiguration> = {
	
	log_level: urn_log.defaults.log_level,
	
};
