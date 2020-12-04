/**
 * Atom configuration types module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

// export type CoreAtomConfig = {
//   atoms: CoreAtomList
// }

// export type CoreAtomList = {
//   [k:string]: CoreAtomDefinition
// }

export type AtomBook = {
	[k:string]: AtomDefinition
};

export type AtomDefinition = {
	properties: AtomProperties,
	mongo_schema: mongoose.SchemaDefinition
}

export type AtomProperties = {
	[k:string]: AtomProperty
}

type AtomProperty =
	AtomPropertyText |
	AtomPropertyLongText |
	AtomPropertyEmail |
	AtomPropertyInteger |
	AtomPropertyFloat |
	AtomPropertyBinary |
	AtomPropertyEncrypted |
	AtomPropertyTime |
	AtomPropertySet |
	AtomPropertyAtom;

export const enum AtomPropertyType {
	TEXT = 'TEXT',
	LONG_TEXT = 'LONG_TEXT',
	EMAIL = 'EMAIL',
	INTEGER = 'INTEGER',
	FLOAT = 'FLOAT',
	BINARY = 'BINARY',
	ENCRYPTED = 'ENCRYPTED',
	TIME = 'TIME',
	SET = 'SET',
	ATOM = 'ATOM'
}

interface AtomFiledShared {
	type: AtomPropertyType,
	label: string,
	required?: boolean
}

interface AtomPropertyText extends AtomFiledShared {
	type: AtomPropertyType.TEXT,
	validation?: AtomPropertyStringValidation
}

interface AtomPropertyLongText extends AtomFiledShared {
	type: AtomPropertyType.LONG_TEXT,
	validation?: AtomPropertyStringValidation
}

interface AtomPropertyEmail extends AtomFiledShared {
	type: AtomPropertyType.EMAIL
}

interface AtomPropertyInteger extends AtomFiledShared {
	type: AtomPropertyType.INTEGER
}

interface AtomPropertyFloat extends AtomFiledShared {
	type: AtomPropertyType.FLOAT,
	format?: AtomPropertyFloatFormat
}

interface AtomPropertyBinary extends AtomFiledShared {
	type: AtomPropertyType.BINARY
	default?: 0 | 1,
	values?: [string, string]
}

interface AtomPropertyEncrypted extends AtomFiledShared {
	type: AtomPropertyType.ENCRYPTED,
	validation?: AtomPropertyStringValidation
}

interface AtomPropertyTime extends AtomFiledShared {
	type: AtomPropertyType.TIME,
	validation?: AtomPropertyTimeValidation
}

interface AtomPropertySet extends AtomFiledShared {
	type: AtomPropertyType.SET,
	values: (string | number)[],
	validation?: AtomPropertySetValidation
}

interface AtomPropertyAtom extends AtomFiledShared {
	type: AtomPropertyType.ATOM,
	atom: string,
	validation?: AtomPropertyAtomValidation
}

interface AtomPropertyStringValidation {
	alphanum?: boolean,
	contain_lowercase?: boolean,
	contain_number?: boolean,
	contain_uppercase?: boolean,
	length?: number,
	letters_only?: boolean,
	lowercase?: boolean,
	max?: number,
	min?: number,
	numbers_only?: boolean,
	reg_ex?: RegExp,
	uppercase?: boolean
}

interface AtomPropertyTimeValidation {
	min?: Date,
	max?: Date
}

interface AtomPropertySetValidation {
	min?: number,
	max?: number,
	length?: number
}

interface AtomPropertyAtomValidation {
	date_from?: Date,
	date_until?: Date
}

interface AtomPropertyFloatFormat {
	decimal?: number,
	decimal_point?: string,
	thousands_step?: string
}


