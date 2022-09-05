/**
 * Core Env module
 *
 * @packageDocumentation
 */

import {urn_context, urn_log} from 'uranio-utils';

import {core_client_env} from '../cln/default_env';

import {ClientEnvironment} from '../typ/env_cln';

const urn_ctx = urn_context.create<Required<ClientEnvironment>>(
	core_client_env,
	is_production(),
	'CORE:ENV:CLIENT'
);

export function is_production():boolean{
	return process.env.NODE_ENV === 'production'
		|| process.env.NODE_ENV === 'PRODUCTION';
}

export function get<k extends keyof ClientEnvironment>(
	param_name:k
):Required<ClientEnvironment>[k]{
	return urn_ctx.get(param_name);
}

export function get_all():Required<ClientEnvironment>{
	return urn_ctx.get_all();
}

export function set(env:Partial<ClientEnvironment>):void{
	urn_ctx.set(env);
}

export function set_client_env():ClientEnvironment{
	
	// Cannot set env as normal because on the browser it is not possible to
	// iterate on the object process.env. Also it is not possible to dynamically
	// assign values to process.env keys. Instead the only way to get value from
	// process.env in the browser is to manually type the key in string like
	// process.env['URN_LOG_LEVEL']
	// urn_ctx.set_env();
	
	const env:ClientEnvironment = {} as ClientEnvironment;
	
	const process_log_level = process.env['URN_LOG_LEVEL'];
	// const process_log_level_dev = process.env['URN_DEV_LOG_LEVEL'];
	
	if(typeof process_log_level === 'string' && process_log_level !== ''){
		if(typeof urn_log.LogLevel[process_log_level as any] === 'number'){
			env['log_level'] = urn_log.LogLevel[process_log_level as any] as
				unknown as urn_log.LogLevel;
		}else{
			env['log_level'] = core_client_env.log_level;
		}
	}else if(typeof process_log_level === 'number' && process_log_level > -1){
		env['log_level'] = process_log_level;
	}
	
	// if(typeof process_log_level_dev === 'string' && process_log_level_dev !== ''){
	// 	if(typeof urn_log.LogLevel[process_log_level_dev as any] === 'number'){
	// 		env['dev_log_level'] = urn_log.LogLevel[process_log_level_dev as any] as
	// 			unknown as urn_log.LogLevel;
	// 	}else{
	// 		env['dev_log_level'] = core_client_env.log_level;
	// 	}
	// }else if(typeof process_log_level_dev === 'number' && process_log_level_dev > -1){
	// 	env['dev_log_level'] = process_log_level_dev;
	// }
	
	set(env);
	
	return env;
}
