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
} from './validate';

export const validate = {
	any,
	molecule,
	atom,
	atom_shape,
	atom_partial,
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
	has_property,
	molecule_to_atom,
	get_subatom_name,
	is_atom,
	is_molecule,
	is_auth_atom_name,
	is_auth_atom,
	is_optional_property,
	hide_hidden_properties
} from './util';

export const util = {
	has_property,
	molecule_to_atom,
	get_subatom_name,
	is_atom,
	is_molecule,
	is_auth_atom_name,
	is_auth_atom,
	is_optional_property,
	hide_hidden_properties
};

import {
	property
} from './fix';

export const fix = {
	property
};

// export * from './encrypt';

