/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_context} from 'urn-lib';

import {core_client_config} from '../client/default_conf';

import {ClientConfiguration} from '../client/types';

import * as env from '../env/client';

import {client_toml} from '../client/toml';

const urn_ctx = urn_context.create<Required<ClientConfiguration>>(
	core_client_config,
	env.is_production()
);
urn_ctx.set(client_toml);

export function get<k extends keyof ClientConfiguration>(
	param_name:k
):Required<ClientConfiguration>[k]{
	return urn_ctx.get(param_name);
}

export function set(config:Partial<ClientConfiguration>):void{
	urn_ctx.set(config);
}

export function get_all():Required<ClientConfiguration>{
	return urn_ctx.get_all();
}
