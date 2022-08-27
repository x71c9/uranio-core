/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {schema} from '../sch/server';

import {atom_book} from '../atom_book';

import {Passport} from '../typ/auth';

import {create as create_media} from './media';

import {BLL} from './bll';

import * as book from '../book/server';

export type BLLInstance = InstanceType<typeof BLL>;

export function create<A extends schema.AtomName>(atom_name:A, passport?:Passport)
		:CustomBLL<A>{
	urn_log.trace(`Create BLL [${atom_name}]`);
	
	const atom_def = book.get_definition(atom_name);
	const bll_def = atom_def.bll;
	if(bll_def && typeof bll_def.class === 'function'){
		return bll_def.class(passport) as CustomBLL<A>;
	}else if(atom_name === '_media'){
		return create_media(passport) as unknown as CustomBLL<A>;
	}else{
		return new BLL<A>(atom_name, passport) as CustomBLL<A>;
	}
	
}

type BllReturnType<T, A extends schema.AtomName> = T extends (...args:any) => BLL<A> ?
	ReturnType<T> : BLL<A>;

type CustomBLL<A extends schema.AtomName> =
	A extends keyof typeof atom_book ?
	'bll' extends keyof typeof atom_book[A] ?
	BllReturnType<typeof atom_book[A]['bll'], A> :
	BLL<A> :
	BLL<A>;

// export type CustomBLL<A extends schema.AtomName> =
//   A extends keyof typeof atom_book ?
//   'bll' extends keyof typeof atom_book[A] ?
//   typeof atom_book[A]['bll'] extends BLL<A> ?
//   typeof atom_book[A]['bll'] :
//   BLL<A> :
//   BLL<A> :
//   BLL<A>;


