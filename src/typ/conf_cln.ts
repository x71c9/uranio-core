/**
 * Client Conf type module
 *
 * @packageDocumentation
 */

type RequiredClientConfigParams = {
}

type OptionalClientConfigParam = {
}

export type ClientConfiguration =
	RequiredClientConfigParams &
	Partial<OptionalClientConfigParam>;
