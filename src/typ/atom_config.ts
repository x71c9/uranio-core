/**
 * Atom configuration types module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {atom_book} from '../urn.config';

export type AtomName = keyof typeof atom_book;

export type PropertiesOfAtom<A extends AtomName> = typeof atom_book[A]['properties'];

type AtomPropertyInferType<A> = A extends {type: infer I} ? I : never;

type AtomTypeOfProperty<A extends AtomName, k extends keyof PropertiesOfAtom<A>> =
	AtomPropertyInferType<PropertiesOfAtom<A>[k]>;

type RealTypeOfAtomProperty<A extends AtomName, k extends keyof PropertiesOfAtom<A>> =
	AtomTypeOfProperty<A,k> extends AtomPropertyType ?
		RealTypeAtomProperty<AtomTypeOfProperty<A,k>> : never;

type AtomDefaultProperties = {
	_id?: RealTypeAtomProperty<AtomPropertyType.ID>,
	_deleted_from?: RealTypeAtomProperty<AtomPropertyType.ID>,
	date?: RealTypeAtomProperty<AtomPropertyType.TIME>
}

export type DeltaGrain<A extends AtomName> = {
	[k in keyof PropertiesOfAtom<A>]: RealTypeOfAtomProperty<A,k>
};

export type Grain<A extends AtomName> = AtomDefaultProperties & DeltaGrain<A>;

export type AtomBook = {
	[k:string]: AtomDefinition
};

export type AtomDefinition = {
	properties: AtomProperties,
	mongo_schema: mongoose.SchemaDefinition
}

export type AtomProperties = {
	[k:string]: AtomProperty,
}

type AtomProperty =
	AtomPropertyID |
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
	ID = 'ID',
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

type RealTypeAtomProperty<AT extends AtomPropertyType> =
	AT extends AtomPropertyType.ID ? string :
	AT extends AtomPropertyType.TEXT ? string :
	AT extends AtomPropertyType.LONG_TEXT ? string :
	AT extends AtomPropertyType.EMAIL ? string :
	AT extends AtomPropertyType.INTEGER ? number :
	AT extends AtomPropertyType.FLOAT ? number :
	AT extends AtomPropertyType.BINARY ? boolean :
	AT extends AtomPropertyType.ENCRYPTED ? string :
	AT extends AtomPropertyType.TIME ? Date :
	AT extends AtomPropertyType.SET ? Array<string | number> :
	AT extends AtomPropertyType.ATOM ? any :
	never;

interface AtomFiledShared {
	type: AtomPropertyType,
	label: string,
	required?: boolean
}

interface AtomPropertyID extends AtomFiledShared {
	type: AtomPropertyType.ID,
	validation?: AtomPropertyStringValidation
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
