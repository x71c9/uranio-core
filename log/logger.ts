/**
 * Logger module
 *
 * @packageDocumentation
 */

import {Atom, AtomShape} from '../types';

import {create_log} from '../dal/log';

export async function debug(msg:string, additional:Partial<AtomShape<'log'>>)
		:Promise<Atom<'log'> | undefined>{
	return _insert_one('error', msg, additional);
}

export async function error(msg:string, additional:Partial<AtomShape<'log'>>)
		:Promise<Atom<'log'> | undefined>{
	return _insert_one('error', msg, additional);
}

async function _insert_one(type:string, msg:string, additional:Partial<AtomShape<'log'>>){
	try{
		additional.type = type;
		additional.msg = msg;
		const log_dal = create_log('log');
		return await log_dal.insert_one(additional as AtomShape<'log'>);
	}catch(ex){
		_save_on_file(type, msg, additional);
	}
}

function _save_on_file(type:string, msg:string, additional:Partial<AtomShape<'log'>>){
	// TODO
	console.error(type, msg, additional);
}
