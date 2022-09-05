/**
 * Env module
 *
 * @packageDocumentation
 */

import {urn_context} from 'uranio-utils';

import {core_env} from './defaults';

import {Environment} from '../typ/env';

const urn_ctx = urn_context.create<Required<Environment>>(
	core_env,
	is_production(),
	'CORE:ENV'
);

export function is_production():boolean{
	return process.env.NODE_ENV === 'production'
		|| process.env.NODE_ENV === 'PRODUCTION';
}

export function get<k extends keyof Environment>(
	param_name:k
):Required<Environment>[k]{
	return urn_ctx.get(param_name);
}

export function set(env:Partial<Environment>):void{
	urn_ctx.set(env);
}

export function get_all():Required<Environment>{
	return urn_ctx.get_all();
}

export function set_env():void{
	urn_ctx.set_env();
}

