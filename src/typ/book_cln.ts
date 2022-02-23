/**
 * Client Book types module
 *
 * This module defines the type of the `atom_book` for the Client.
 *
 * @packageDocumentation
 */

// import schema from 'uranio-schema';

import {schema} from '../sch/server';

// import {schema.AtomName} from './atom';

// import {Property} from './common';

export type ConnectionName = 'main' | 'trash' | 'log';

export enum PropertyType {
	ID = 'ID',
	TEXT = 'TEXT',
	LONG_TEXT = 'LONG_TEXT',
	EMAIL = 'EMAIL',
	INTEGER = 'INTEGER',
	FLOAT = 'FLOAT',
	BINARY = 'BINARY',
	ENCRYPTED = 'ENCRYPTED',
	DAY = 'DAY',
	TIME = 'TIME',
	ENUM_STRING = 'ENUM_STRING',
	ENUM_NUMBER = 'ENUM_NUMBER',
	SET_STRING = 'SET_STRING',
	SET_NUMBER = 'SET_NUMBER',
	ATOM = 'ATOM',
	ATOM_ARRAY = 'ATOM_ARRAY'
}

export enum SecurityType {
	UNIFORM = 'UNIFORM',
	GRANULAR = 'GRANULAR'
}

export enum PermissionType {
	NOBODY = 'NOBODY',
	PUBLIC = 'PUBLIC'
}

export type Book = {
	[k:string]: Book.Definition;
}

export namespace Book {
	
	// type BasicDefinition = {
	//   properties: Definition.Properties
	//   authenticate?: boolean
	//   connection?: ConnectionName
	//   plural?: string
	// }
	
	export type Definition = {
		properties: Definition.Properties
		authenticate?: boolean
		connection?: ConnectionName
		plural?: string
	}
	
	export namespace Definition {
		
		export type Properties = {
			[k:string]: Property
		}
		
		export type Property =
			Property.ID |
			Property.Text |
			Property.LongText |
			Property.Email |
			Property.Integer |
			Property.Float |
			Property.Binary |
			Property.Encrypted |
			Property.Day |
			Property.Time |
			Property.SetString |
			Property.SetNumber |
			Property.EnumString |
			Property.EnumNumber |
			Property.Atom |
			Property.AtomArray;
		
		export namespace Property {
		
			export interface SharedFields {
				type: PropertyType
				label: string
				optional?: boolean
				hidden?: boolean
				unique?: boolean
				default?: any
				on_error?: (old_value: any) => any
			}
			
			export interface ID extends SharedFields {
				type: PropertyType.ID
				validation?: Validation.String
			}
			
			export interface Text extends SharedFields {
				type: PropertyType.TEXT
				validation?: Validation.String
			}
			
			export interface LongText extends SharedFields {
				type: PropertyType.LONG_TEXT
				validation?: Validation.String
			}
			
			export type String =
				Text |
				LongText |
				Encrypted;
			
			export type Number =
				Integer |
				Float;
			
			export type Enum =
				EnumString |
				EnumNumber;
			
			export type Set =
				SetString |
				SetNumber;
			
			export type DayTime =
				Day |
				Time;
			
			export interface Email extends SharedFields {
				type: PropertyType.EMAIL
			}
			
			export interface Integer extends SharedFields {
				type: PropertyType.INTEGER
				validation?: Validation.Number
			}
			
			export interface Float extends SharedFields {
				type: PropertyType.FLOAT
				validation?: Validation.Number
				format?: Format.Float
			}
			
			export interface Binary extends SharedFields {
				type: PropertyType.BINARY
				default?: false | true
				values?: [string, string]
			}
			
			export interface Encrypted extends SharedFields {
				type: PropertyType.ENCRYPTED
				validation?: Validation.String
			}
			
			export interface Day extends SharedFields {
				type: PropertyType.DAY
				default?: Date | 'NOW'
				validation?: Validation.DayTime
			}
			
			export interface Time extends SharedFields {
				type: PropertyType.TIME
				default?: Date | 'NOW'
				validation?: Validation.DayTime
			}
			
			export interface EnumString extends SharedFields {
				type: PropertyType.ENUM_STRING
				values: string[]
				default?: string
			}
			
			export interface EnumNumber extends SharedFields {
				type: PropertyType.ENUM_NUMBER
				values: number[]
				default?: number
			}
			
			export interface SetString extends SharedFields {
				type: PropertyType.SET_STRING
				validation?: Validation.SetString
			}
			
			export interface SetNumber extends SharedFields {
				type: PropertyType.SET_NUMBER
				validation?: Validation.SetNumber
			}
			
			export interface Atom extends SharedFields {
				type: PropertyType.ATOM
				atom: schema.AtomName
				delete_cascade?: boolean
				validation?: Validation.Atom
			}
			
			export interface AtomArray extends SharedFields {
				type: PropertyType.ATOM_ARRAY
				atom: schema.AtomName
				delete_cascade?: boolean
				validation?: Validation.Atom
			}
			
			export namespace Format {
				
				export interface Float {
					decimal?: number
					decimal_point?: string
					thousands_step?: string
				}
				
			}
			
			export namespace Validation {
				
				export interface String {
					alphanum?: boolean
					contain_digit?: boolean
					contain_lowercase?: boolean
					contain_uppercase?: boolean
					length?: number
					lowercase?: boolean
					max?: number
					min?: number
					only_letters?: boolean
					only_numbers?: boolean
					reg_ex?: RegExp
					uppercase?: boolean
				}
				
				export interface Number {
					min?: number
					max?: number
					eq?: number
				}
				
				export interface DayTime {
					min?: Date
					max?: Date
					eq?: Date
				}
				
				export interface SetString {
					min?: number
					max?: number
					length?: number
					values?: string[]
				}
				
				export interface SetNumber {
					min?: number
					max?: number
					length?: number
					values?: number[]
				}
				
				export interface Atom {
					date_from?: Date
					date_until?: Date
				}
				
				// export type DefinitionValidation =
				//   StringValidation |
				//   NumberValidation |
				//   NumberValidation |
				//   TimeValidation |
				//   SetStringValidation |
				//   SetNumberValidation |
				//   AtomValidation;
				
			}
			
		}
		
	}
	
}


