/**
 * Static types module
 *
 * This modules defines all the static definitions
 *
 * @packageDocumentation
 */

import {PropertyType} from '../typ/book_cln';

export const atom_hard_properties = {
	_id: {
		type: PropertyType.ID,
		label: '_id',
	},
	_date: {
		type: PropertyType.TIME,
		label: '_date',
		default: 'NOW',
		on_error: () => {return new Date();}
	}
} as const;

export const atom_common_properties = {
	_r:{
		type: PropertyType.ID,
		label: '_r',
		optional: true
	},
	_w:{
		type: PropertyType.ID,
		label: '_w',
		optional: true
	},
	_from: {
		type: PropertyType.ID,
		label: 'Deleted from',
		optional: true
	}
} as const;

export const abstract_passport = {
	_id: 'string',
	auth_atom_name: 'string',
	groups: 'string[]'
} as const;

export const real_book_property_type = {
	ID: 'string',
	TEXT: 'string',
	LONG_TEXT: 'string',
	EMAIL: 'string',
	INTEGER: 'number',
	FLOAT: 'number',
	BINARY: 'boolean',
	ENCRYPTED: 'string',
	DAY: 'datetime',
	TIME: 'datetime',
	ENUM_STRING: 'string',
	ENUM_NUMBER: 'number',
	SET_STRING: 'string[]',
	SET_NUMBER: 'number[]',
	ATOM: 'object',
	ATOM_ARRAY: 'object[]'
} as const;

