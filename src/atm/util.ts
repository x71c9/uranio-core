/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_UTIL', `Atom Util modul`);

import {atom_book} from '../book';

import {
	AtomName,
	Book,
	BookPropertyType
} from '../types';

export function get_atom_name<A extends AtomName>(atom_name:A ,atom_key:string)
		:AtomName{
	const atom_def = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	if(atom_def[atom_key]){
		if(
			atom_def[atom_key].type === BookPropertyType.ATOM ||
			atom_def[atom_key].type === BookPropertyType.ATOM_ARRAY
		){
			if((atom_def[atom_key] as Book.Definition.Property.Atom).atom){
				return (atom_def[atom_key] as Book.Definition.Property.Atom).atom;
			}else{
				let err_msg = `Invalid book property definition for [${atom_key}].`;
				err_msg += ` Missing 'atom' field.`;
				throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP', err_msg);
			}
		}else{
			let err_msg = `Invalid book property type for [${atom_key}].`;
			err_msg += ` Type shlould be ATOM or ATOM_ARRAY.`;
			throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP_TYPE', err_msg);
		}
	}else{
		let err_msg = `Invalid key [${atom_key}].`;
		err_msg += ` Key should be an AtomName.`;
		throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
	}
}

