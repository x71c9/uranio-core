/**
 * Index module for Atom
 *
 * @packageDocumentation
 */

import {
	any,
	molecule,
	atom,
	atom_shape,
	atom_partial,
	is_valid_property,
	is_optional_property
} from './validate';

export const validate = {
	any,
	molecule,
	atom,
	atom_shape,
	atom_partial,
	is_valid_property,
	is_optional_property
};

import {
	get_hidden,
	get_encrypted,
	get_unique,
	get_bond,
	get_bond_array,
	get_bond_non_array
} from './keys';

export const keys = {
	get_hidden,
	get_encrypted,
	get_unique,
	get_bond,
	get_bond_array,
	get_bond_non_array
};

import {
	molecule_to_atom,
	get_subatom_name,
	is_atom,
	is_molecule,
	is_auth_atom_name,
	is_auth_atom,
	hide_hidden_properties
} from './util';

export const util = {
	molecule_to_atom,
	get_subatom_name,
	is_atom,
	is_molecule,
	is_auth_atom_name,
	is_auth_atom,
	hide_hidden_properties
};

// export * from './encrypt';

