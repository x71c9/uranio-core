/**
 * Common module for schema.Atom Book Methods
 *
 * Since type Book is different between Server and Client we need two different
 * module with methods with different return types.
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BOOK_METHODS_MODULE', `Book methods module`);

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

import {atom_book} from '../base';

// import {
//   schema.AtomName,
//   schema.AuthName
// } from '../../cln/types';

import {Book} from '../typ/book_cln';

import {atom_hard_properties, atom_common_properties} from '../stc/index';

export function validate_name(atom_name:string):atom_name is schema.AtomName{
	return urn_util.object.has_key(atom_book, atom_name);
}

export function validate_auth_name(auth_name:string):auth_name is schema.AuthName{
	if(!validate_name(auth_name)){
		return false;
	}
	const atom_def = get_definition(auth_name as schema.AtomName);
	return atom_def.authenticate === true;
}

export function get_all_definitions():Book{
	return atom_book as unknown as Book;
}

export function get_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition{
	return atom_book[atom_name] as unknown as Book.Definition;
}

export function get_property_definition<A extends schema.AtomName>(
	atom_name:A,
	property_name:keyof Book.Definition.Properties
):Book.Definition.Property{
	// const prop_defs = atom_book[atom_name].properties;
	// if(urn_util.object.has_key(prop_defs, property_name)){
	//   return prop_defs[property_name];
	// }else if(urn_util.object.has_key(atom_hard_properties, property_name)){
	//   return atom_hard_properties[property_name];
	// }else if(urn_util.object.has_key(atom_common_properties, property_name)){
	//   return atom_common_properties[property_name];
	// }
	const all_prop_def = get_all_property_definitions(atom_name);
	if(!urn_util.object.has_key(all_prop_def, property_name)){
		throw urn_exc.create(
			'INVALID_PROPERTY_NAME',
			`Definition for \`${property_name}\` for Atom \`${atom_name}\` not found.`
		);
	}
	return all_prop_def[property_name];
}

export function get_custom_property_definitions<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	const atom_def = atom_book[atom_name] as unknown as Book.Definition;
	return atom_def.properties as Book.Definition.Properties;
}

export function get_all_property_definitions<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	const custom_defs = get_custom_property_definitions(atom_name);
	const prop_defs = {
		...atom_hard_properties,
		...atom_common_properties,
		...custom_defs
	};
	return prop_defs;
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	if(urn_util.object.has_key(atom_hard_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_common_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_book[atom_name]['properties'], key)){
		return true;
	}
	return false;
}

