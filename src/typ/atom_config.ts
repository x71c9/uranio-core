/**
 * Atom configuration types module
 *
 * @packageDocumentation
 */

import {atom_book} from '../urn.config';

export type AtomName = keyof typeof atom_book;



const my_constant = {
    user: {
        props: {
            name: {
                type: 'string',
                label: ''
            },
            id: {
                type: 'number',
                label: 'ID'
            }
        }
    },
    media: {
        props: {
            id: {
                label: 'ID',
                type: 'number'
            }
        }
    }
} as const;

type Name = keyof typeof my_constant;

type CType = typeof my_constant['user']['props']['name']['type'];

type MType<N extends Name, K extends keyof typeof my_constant[N]['props']> =
    typeof my_constant[N]['props'][K];

type G<M> = M extends {readonly type: infer I} ? I : never;

//const ll:G<MType<'user', 'eid'>> = '';

type Constructed<T extends Name> = {
    [K in keyof typeof my_constant[T]['props']]: G<typeof my_constant[T]['props'][K]>
    //[K in keyof typeof my_constant[T]['props']]: typeof my_constant[N]['props'][K]
    //[K in keyof typeof my_constant[T]['props']]: TypeOfProp<T,K,'type'>
    //[K in keyof typeof my_constant[T]['props']]: PropType
}

type KeyofPropType<
    N extends Name,
    K extends keyof typeof my_constant[N]['props']
    > = keyof typeof my_constant[N]['props'][K]

const kk:KeyofPropType<'user','name'> = 'type';

type TypeOfProp<
    N extends Name,
    K extends keyof typeof my_constant[N]['props'],
    P extends KeyofPropType<N,K>> = P extends string ? typeof my_constant[N]['props'][K][P] : never;


const jj:TypeOfProp<'user','name','type'> = 'string';

const a:Constructed<'user'> = {
    name: 'string',
    id: 'number'
}

const b:Constructed<'media'> = {
    id: 'number'
}






























// type TypeValues<A extends AtomName, K> = MapType[atom_book[A]['properties'][K]['type']];

type PropKeys<A extends AtomName> = keyof typeof atom_book[A]['properties'];
type PropType<A extends AtomName, P extends PropKeys<A>> = typeof atom_book[A]['properties'][P]['type']

export type Grain<A extends AtomName> = {
	[K in PropKeys<A>]: keyof typeof atom_book[A]['properties'][K]['type']
}

// export type PropDef<N extends AtomName, P extends keyof typeof atom_book[N]['properties']> =
//   typeof atom_book[N]['properties'][P];

// export type MType<N extends AtomName, P extends keyof typeof atom_book[N]['properties']> =
//   PropDef<N,P>['type'];

// export const rr:PropDef<'superuser', 'email'> = {
	
// };

export interface MapType {
	'TEXT': string,
	'LONG_TEXT': string,
	'EMAIL': string,
	'INTEGER': number,
	'FLOAT': number,
	'BINARY': boolean,
	'ENCRYPTED': string,
	'TIME': number,
	'SET': (string|number)[],
	'ATOM': any
}

// export type Mapped<T extends AtomPropertyType> =
//   T extends AtomPropertyType.ATOM ? 'ATOM' :
//   T extends AtomPropertyType.BINARY ? 'BINARY' :
//   T extends AtomPropertyType.EMAIL ? 'EMAIL' : never;

// const yy:Mapped<AtomPropertyType.EMAIL> = 'EMAIL';
// console.log(yy);


// type B<K extends keyof MapType> = MapType[K];

// type GetType<P extends AtomProperty> = P['type'];

// const l:GetType<AtomPropertyText> = 'TEXT';
// console.log(l);

export const a:Grain<'superuser'> = {
	password: 1,
	email: 1
};



// type Inferno<N extends AtomName, K extends keyof typeof atom_book[N]['properties']> =
//   typeof atom_book[N]['properties'][K]['type'];

// const tt:Inferno<'superuser', 'email'> = 'EMAIL';
// console.log(tt);

// type CType<N extends AtomName, P extends keyof typeof atom_book[N]['properties'] =
//   Inferno<N,P>['type'];



// import mongoose from 'mongoose';

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
	// mongo_schema: mongoose.SchemaDefinition
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

export enum AtomPropertyType {
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


