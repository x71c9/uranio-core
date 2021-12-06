/**
 * Module for Book Methods
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BOOK_METHODS_MODULE', `Book methods module`);

import {atom_book} from 'uranio-books/atom';

// import {dock_book} from 'uranio-books/dock';

import {
	// Atom,
	// AtomShape,
	AtomName,
	// AuthAtom,
	// AuthName,
	// Molecule,
	// Depth,
} from '../typ/atom';

import {Book} from '../typ/book_cln';

// import {BookPropertyType} from '../typ/common';

import {
	atom_hard_properties,
	atom_common_properties,
} from '../stc/';

export function get_property_definition<A extends AtomName>(atom_name:A, property_name:keyof Book.Definition.Properties)
		:Book.Definition.Property{
	const prop_defs = atom_book[atom_name].properties;
	if(urn_util.object.has_key(prop_defs, property_name)){
		return prop_defs[property_name];
	}else if(urn_util.object.has_key(atom_hard_properties, property_name)){
		return atom_hard_properties[property_name];
	}else if(urn_util.object.has_key(atom_common_properties, property_name)){
		return atom_common_properties[property_name];
	}
	throw urn_exc.create('INVALID_PROPERTY_NAME', `Definition for \`${property_name}\` for Atom \`${atom_name}\` not found.`);
}
