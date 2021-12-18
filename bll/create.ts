/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {bll_book} from 'uranio-books/bll';

import {AtomName} from '../typ/atom';

import {Passport} from '../typ/auth';

import {create as create_media} from './media';

import {BLL} from './bll';

import * as book from '../book/';

export type BLLInstance = InstanceType<typeof BLL>;

export function create<A extends AtomName>(atom_name:A, passport?:Passport)
		:CustomBLL<A>{
	urn_log.fn_debug(`Create BLL [${atom_name}]`);
	
	const bll_def = book.bll.get_definition(atom_name);
	if(bll_def && typeof bll_def.class === 'function'){
		return bll_def.class(passport) as CustomBLL<A>;
	}else if(atom_name === 'media'){
		return create_media(passport) as CustomBLL<A>;
	}else{
		return new BLL<A>(atom_name, passport) as CustomBLL<A>;
	}
	
}

type BllReturnType<T, A extends AtomName> = T extends (...args:any) => BLL<A> ?
	ReturnType<T> : BLL<A>;

type CustomBLL<A extends AtomName> =
	A extends keyof typeof bll_book ?
	'bll' extends keyof typeof bll_book[A] ?
	BllReturnType<typeof bll_book[A]['bll'], A> :
	BLL<A> :
	BLL<A>;

// export type CustomBLL<A extends AtomName> =
//   A extends keyof typeof bll_book ?
//   'bll' extends keyof typeof bll_book[A] ?
//   typeof bll_book[A]['bll'] extends BLL<A> ?
//   typeof bll_book[A]['bll'] :
//   BLL<A> :
//   BLL<A> :
//   BLL<A>;


