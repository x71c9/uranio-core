/**
 * Client Conf type module
 *
 * @packageDocumentation
 */
import {urn_log} from 'urn-lib';

type RequiredClientConfigParams = {
}

type OptionalClientConfigParam = {
	log_level: urn_log.LogLevel
}

export type ClientConfiguration =
	RequiredClientConfigParams &
	Partial<OptionalClientConfigParam>;
