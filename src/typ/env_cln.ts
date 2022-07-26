/**
 * Client Env type module
 *
 * @packageDocumentation
 */
import {urn_log} from 'urn-lib';

type RequiredClientEnvParams = {
}

type OptionalClientEnvParam = {
	
	log_level: urn_log.LogLevel
	
	dev_log_level: urn_log.LogLevel
	
}

export type ClientEnvironment =
	RequiredClientEnvParams &
	Partial<OptionalClientEnvParam>;
