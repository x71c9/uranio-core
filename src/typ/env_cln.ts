/**
 * Client Env type module
 *
 * @packageDocumentation
 */
import {urn_log} from 'uranio-utils';

type RequiredClientEnvParams = {
}

type OptionalClientEnvParam = {
	
	log_level: urn_log.LogLevel
	
	// dev_log_level: urn_log.LogLevel
	
}

export type ClientEnvironment =
	RequiredClientEnvParams &
	Partial<OptionalClientEnvParam>;
