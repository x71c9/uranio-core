/**
 * Module for Server Dock Book Methods
 *
 * @packageDocumentation
 */

import {AtomName} from '../../typ/atom';

import {Book, BllBook} from '../../typ/book_srv';

import {bll_book} from 'uranio-books/bll';

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.Definition.Bll<A> | undefined{
	return (bll_book[atom_name] as Book.Definition<A>).bll;
}

export function get_all_definitions()
		:BllBook{
	const bll_book_def = {} as BllBook;
	let atom_name:AtomName;
	for(atom_name in bll_book){
		const def = get_definition(atom_name);
		if(def){
			(bll_book_def as any)[atom_name] = def;
		}
	}
	return bll_book_def;
}
