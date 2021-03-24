/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {bll_book} from 'urn_books';

import {
	AtomName,
	Passport,
	Book
} from '../typ/';

import {BLL} from './bll';

export type BLLInstance = InstanceType<typeof BLL>;

export function create<A extends AtomName>(atom_name:A, passport?:Passport)
		:CustomBLL<A>{
	urn_log.fn_debug(`Create BLL [${atom_name}]`);
	const atom_def = bll_book[atom_name] as Partial<Book.Definition<A>>;
	if(
		'bll' in atom_def &&
		atom_def.bll &&
		typeof atom_def.bll === 'function'
	){
		return atom_def.bll(passport) as CustomBLL<A>;
	}else{
		return new BLL<A>(atom_name, passport) as CustomBLL<A>;
	}
	// if(
	//   'bll' in atom_def &&
	//   atom_def.bll &&
	//   typeof atom_def.bll === 'function' &&
	//   atom_def.bll().prototype &&
	//   atom_def.bll().prototype.constructor.name === 'BLL'
	// ){
	//   return new (atom_def.bll())(passport) as CustomBLL<A>;
	// }else{
	//   return new BLL<A>(atom_name, passport) as CustomBLL<A>;
	// }
}

export type CustomBLL<A extends AtomName> =
	A extends keyof typeof bll_book ?
	'bll' extends keyof typeof bll_book[A] ?
	typeof bll_book[A]['bll'] extends BLL<A> ?
	typeof bll_book[A]['bll'] :
	BLL<A> :
	BLL<A> :
	BLL<A>;


