/**
 * Shared type module
 *
 * @packageDocumentation
 */

import {atom_book} from './book';

export const atom_hard_properties = {
	_id: {
		type: AtomPropertyType.ID,
		label: '_id',
	},
	_date: {
		type: AtomPropertyType.TIME,
		label: '_date',
		default: 'NOW'
	}
} as const;

export const atom_common_properties = {
	_deleted_from: {
		type: AtomPropertyType.ID,
		label: 'Deleted from',
		optional: true
	},
	active: {
		type: AtomPropertyType.BINARY,
		label: 'Active'
	}
} as const;

export type AtomName = keyof typeof atom_book;

export type PropertiesOfAtomDefinition<A extends AtomName> = typeof atom_book[A]['properties'];

export type KeyOfHardProperties = keyof typeof atom_hard_properties;

export type KeyOfCommonProperties = keyof typeof atom_common_properties;


type PickSubType<Base, Condition> = Pick<Base, {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type OmitSubType<Base, Condition> = Omit<Base, {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type ExtractOptional<P> = PickSubType<P, {optional: true}>;

type ExcludeOptional<P> = OmitSubType<P, {optional: true}>;


type AtomDefinitionPropertyInferType<P> = P extends {type: infer I} ? I : never;

type AtomTypeOfProperty<A extends AtomName, k extends CustomKeyOfAtomShape<A>> =
	AtomDefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;

type RealTypeOfAtomProperty<A extends AtomName, k extends CustomKeyOfAtomShape<A>> =
	AtomTypeOfProperty<A,k> extends AtomPropertyType ?
		RealTypeAtomProperty<AtomTypeOfProperty<A,k>> : never;

type AtomTypeOfHardProperty<k extends KeyOfHardProperties> =
	AtomDefinitionPropertyInferType<typeof atom_hard_properties[k]>;

type AtomTypeOfCommonProperty<k extends KeyOfCommonProperties> =
	AtomDefinitionPropertyInferType<typeof atom_common_properties[k]>;

type RealTypeOfAtomHardProperty<k extends KeyOfHardProperties> =
	RealTypeAtomProperty<AtomTypeOfHardProperty<k>>;

type RealTypeOfAtomCommonProperty<k extends KeyOfCommonProperties> =
	RealTypeAtomProperty<AtomTypeOfCommonProperty<k>>;

type AtomHardProperties = {
	[k in KeyOfHardProperties]: RealTypeOfAtomHardProperty<k>
}

export type OptionalKeyOfAtomProperties<A extends AtomName> =
	keyof ExtractOptional<PropertiesOfAtomDefinition<A>>;

export type RequiredKeyOfAtomProperties<A extends AtomName> =
	keyof ExcludeOptional<PropertiesOfAtomDefinition<A>>;

export type OptionalKeyOfAtomCommonProperties =
	keyof ExtractOptional<typeof atom_common_properties>;

export type RequiredKeyOfAtomCommonProperties =
	keyof ExcludeOptional<typeof atom_common_properties>;

export type CustomKeyOfAtomShape<A extends AtomName> =
	RequiredKeyOfAtomProperties<A> |
	OptionalKeyOfAtomProperties<A>


export type KeyOfAtomShape<A extends AtomName> =
	CustomKeyOfAtomShape<A> |
	RequiredKeyOfAtomCommonProperties |
	OptionalKeyOfAtomCommonProperties;

export type AtomShape<A extends AtomName> = {
	[k in RequiredKeyOfAtomProperties<A>]: RealTypeOfAtomProperty<A,k>
} & {
	[k in OptionalKeyOfAtomProperties<A>]?: RealTypeOfAtomProperty<A,k>
} & {
	[k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k>
} & {
	[k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k>
};

export type KeyOfAtom<A extends AtomName> =
	KeyOfAtomShape<A> | KeyOfHardProperties | KeyOfCommonProperties;

export type Atom<A extends AtomName> = AtomHardProperties & AtomShape<A>;


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
	AtomPropertySetString |
	AtomPropertySetNumber |
	AtomPropertyEnumString |
	AtomPropertyEnumNumber |
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
	ENUM_STRING = 'ENUM_STRING',
	ENUM_NUMBER = 'ENUM_NUMBER',
	SET_STRING = 'SET_STRING',
	SET_NUMBER = 'SET_NUMBER',
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
	AT extends AtomPropertyType.SET_STRING ? Array<string> :
	AT extends AtomPropertyType.SET_NUMBER ? Array<number> :
	AT extends AtomPropertyType.ENUM_STRING ? string :
	AT extends AtomPropertyType.ENUM_NUMBER ? number :
	AT extends AtomPropertyType.ATOM ? any :
	never;

interface AtomFieldShared {
	type: AtomPropertyType,
	label: string,
	optional?: boolean,
	unique?: boolean
}

interface AtomPropertyID extends AtomFieldShared {
	type: AtomPropertyType.ID,
	validation?: AtomPropertyStringValidation
}

interface AtomPropertyText extends AtomFieldShared {
	type: AtomPropertyType.TEXT,
	validation?: AtomPropertyStringValidation
}

interface AtomPropertyLongText extends AtomFieldShared {
	type: AtomPropertyType.LONG_TEXT,
	validation?: AtomPropertyStringValidation
}

export type AtomPropertyString =
	AtomPropertyText |
	AtomPropertyLongText |
	AtomPropertyEncrypted;

export type AtomPropertyNumber =
	AtomPropertyInteger |
	AtomPropertyFloat;

export type AtomPropertyEnum =
	AtomPropertyEnumString |
	AtomPropertyEnumNumber;

export type AtomPropertySet =
	AtomPropertySetString |
	AtomPropertySetNumber;

interface AtomPropertyEmail extends AtomFieldShared {
	type: AtomPropertyType.EMAIL
}

interface AtomPropertyInteger extends AtomFieldShared {
	type: AtomPropertyType.INTEGER,
	validation?: AtomPropertyNumberValidation
}

interface AtomPropertyFloat extends AtomFieldShared {
	type: AtomPropertyType.FLOAT,
	validation?: AtomPropertyNumberValidation
	format?: AtomPropertyFloatFormat
}

interface AtomPropertyBinary extends AtomFieldShared {
	type: AtomPropertyType.BINARY
	default?: false | true,
	values?: [string, string]
}

export interface AtomPropertyEncrypted extends AtomFieldShared {
	type: AtomPropertyType.ENCRYPTED,
	validation?: AtomPropertyStringValidation
}

export interface AtomPropertyTime extends AtomFieldShared {
	type: AtomPropertyType.TIME,
	default?: Date | 'NOW',
	validation?: AtomPropertyTimeValidation
}

export interface AtomPropertyEnumString extends AtomFieldShared {
	type: AtomPropertyType.ENUM_STRING,
	values: string[],
	default?: string
}

export interface AtomPropertyEnumNumber extends AtomFieldShared {
	type: AtomPropertyType.ENUM_NUMBER,
	values: number[],
	default?: number
}

export interface AtomPropertySetString extends AtomFieldShared {
	type: AtomPropertyType.SET_STRING,
	validation?: AtomPropertySetStringValidation
}

export interface AtomPropertySetNumber extends AtomFieldShared {
	type: AtomPropertyType.SET_NUMBER,
	validation?: AtomPropertySetNumberValidation
}

interface AtomPropertyAtom extends AtomFieldShared {
	type: AtomPropertyType.ATOM,
	atom: AtomName,
	validation?: AtomPropertyAtomValidation
}

interface AtomPropertyStringValidation {
	alphanum?: boolean,
	contain_digit?: boolean,
	contain_lowercase?: boolean,
	contain_uppercase?: boolean,
	length?: number,
	lowercase?: boolean,
	max?: number,
	min?: number,
	only_letters?: boolean,
	only_numbers?: boolean,
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

interface AtomPropertySetStringValidation {
	min?: number,
	max?: number,
	length?: number
	values?: string[],
}

interface AtomPropertySetNumberValidation {
	min?: number,
	max?: number,
	length?: number
	values?: number[],
}

interface AtomPropertyAtomValidation {
	date_from?: Date,
	date_until?: Date
}

export type AtomPropertyDefinitionValidation =
	AtomPropertyStringValidation |
	AtomPropertyNumberValidation |
	AtomPropertyNumberValidation |
	AtomPropertyTimeValidation |
	AtomPropertySetStringValidation |
	AtomPropertySetNumberValidation |
	AtomPropertyAtomValidation;

interface AtomPropertyFloatFormat {
	decimal?: number,
	decimal_point?: string,
	thousands_step?: string
}


type QueryBase = string | number | boolean | Date;

type QueryEqual<A extends AtomName> = {
	[P in KeyOfAtom<A>]?: QueryBase;
}

type QueryComparsion =
	{ $eq?: QueryBase } |
	{ $gt?: QueryBase } |
	{ $gte?: QueryBase } |
	{ $in?: QueryBase[] } |
	{ $lt?: QueryBase } |
	{ $lte?: QueryBase } |
	{ $ne?: QueryBase } |
	{ $nin?: QueryBase[] }

type QueryWithComparsion<A extends AtomName> = {
	[P in KeyOfAtom<A>]?: QueryComparsion;
}

export type QueryExpression<A extends AtomName> = QueryEqual<A> | QueryWithComparsion<A>;

export type QueryLogical<A extends AtomName> =
	{ $and?: (QueryExpression<A> | QueryLogical<A>)[] } |
	{ $not?: QueryExpression<A> | QueryLogical<A> } |
	{ $nor?: (QueryExpression<A> | QueryLogical<A>)[] } |
	{ $or?: (QueryExpression<A>  | QueryLogical<A>)[] }

export type Query<A extends AtomName> = QueryExpression<A> | QueryLogical<A>;

// const a1:Query<'superuser'> = {email: ''};
// const a2:Query<'superuser'> = {email: {$eq: ''}};
// const a3:Query<'superuser'> = {$and: [{email: ''}, {password: {$lte: 3}}]};
// const a4:Query<'superuser'> = {$or: []};
// const a5:Query<'superuser'> = {$nor: [{$and: []}]};
// const a6:Query<'superuser'> = {$not: {email: ''}};
// const a7:Query<'superuser'> = {$nor:[{$not: {$and:[{password: {$nin: ['']}}]}}]};
// console.log(a1,a2,a3,a4,a5,a6,a7);


export type QueryOptions<A extends AtomName> = {
	sort?: string | QueryEqual<A>;
	limit?: number;
	skip?: number;
}

export type DatabaseType = 'mongo'; // | 'mysql'

export type Configuration = {
	
	db_type: DatabaseType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
	encryption_round: number;
	
	max_password_length: number;
	
}


