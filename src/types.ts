/**
 * Shared type module
 *
 * @packageDocumentation
 */

import {atom_book} from './book';

export const atom_default_properties = {
	_id: {
		type: AtomPropertyType.ID,
		label: '_id',
	},
	_deleted_from: {
		type: AtomPropertyType.ID,
		label: '_deleted_from',
		optional: true
	},
	_date: {
		type: AtomPropertyType.TIME,
		label: '_date'
	}
} as const;

export type AtomName = keyof typeof atom_book;

export type PropertiesOfAtomDefinition<A extends AtomName> = typeof atom_book[A]['properties'];

export type KeyOfDefaultProperties = keyof typeof atom_default_properties;


type AtomDefinitionPropertyInferType<P> = P extends {type: infer I} ? I : never;

type AtomTypeOfProperty<A extends AtomName, k extends KeyOfAtomShape<A>> =
	AtomDefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;

type RealTypeOfAtomProperty<A extends AtomName, k extends KeyOfAtomShape<A>> =
	AtomTypeOfProperty<A,k> extends AtomPropertyType ?
		RealTypeAtomProperty<AtomTypeOfProperty<A,k>> : never;

type AtomTypeOfDefaultProperty<k extends KeyOfDefaultProperties> =
	AtomDefinitionPropertyInferType<typeof atom_default_properties[k]>;

type RealTypeOfAtomDefaultProperty<k extends KeyOfDefaultProperties> =
	RealTypeAtomProperty<AtomTypeOfDefaultProperty<k>>;

type AtomDefaultProperties = {
	[k in KeyOfDefaultProperties]: RealTypeOfAtomDefaultProperty<k>
}


export type KeyOfAtomShape<A extends AtomName> = keyof PropertiesOfAtomDefinition<A>;

export type KeyOfAtom<A extends AtomName> =
	KeyOfAtomShape<A> & KeyOfDefaultProperties;


export type AtomShape<A extends AtomName> = {
	[k in KeyOfAtomShape<A>]: RealTypeOfAtomProperty<A,k>
};

export type Atom<A extends AtomName> = AtomDefaultProperties & AtomShape<A>;


type SubType<Base, Condition> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type ExtractOptional<P> = SubType<P, {optional: true}>;


export type AtomBook = {
	[k:string]: AtomDefinition
};

export type AtomDefinition = {
	properties: AtomPropertiesDefinition
}

export type AtomPropertiesDefinition = {
	[k:string]: AtomPropertyDefinition,
}

export type AtomPropertyDefinition =
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
	optional?: boolean,
	unique?: boolean
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
	type: AtomPropertyType.INTEGER,
	validation?: AtomPropertyNumberValidation
}

interface AtomPropertyFloat extends AtomFiledShared {
	type: AtomPropertyType.FLOAT,
	validation?: AtomPropertyNumberValidation
	format?: AtomPropertyFloatFormat
}

interface AtomPropertyBinary extends AtomFiledShared {
	type: AtomPropertyType.BINARY
	default?: false | true,
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
	atom: AtomName,
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

interface AtomPropertyNumberValidation {
	min?: number,
	max?: number,
	eq?: number
}

interface AtomPropertyTimeValidation {
	min?: Date,
	max?: Date,
	eq?: Date
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


type KeyObjectOfAtom<A extends AtomName> = {
	[P in KeyOfAtom<A>]?: any;
}

export type QueryOptions<A extends AtomName> = {
	sort?: string | KeyObjectOfAtom<A>;
	limit?: number;
	skip?: number;
}

type FilterLogicType<A extends AtomName> = {
	$and?: KeyObjectOfAtom<A>[],
	$or?: KeyObjectOfAtom<A>[],
	$nor?: KeyObjectOfAtom<A>[],
	$not?: KeyObjectOfAtom<A>[]
};

export type FilterType<A extends AtomName> = KeyObjectOfAtom<A> & FilterLogicType<A>;

export type DatabaseType = 'mongo'; // | 'mysql'

export type Configuration = {
	
	db_type: DatabaseType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
}


