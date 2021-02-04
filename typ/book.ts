/**
 * Book types module
 *
 * @packageDocumentation
 */

import {AtomName} from './atom';

export const enum BookPropertyType {
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
	ATOM = 'ATOM',
	ATOM_ARRAY = 'ATOM_ARRAY'
}

export const enum BookSecurityType {
	UNIFORM = 'UNIFORM',
	GRANULAR = 'GRANULAR'
}

export type RealType<AT extends BookPropertyType> =
	AT extends BookPropertyType.ID ? string :
	AT extends BookPropertyType.TEXT ? string :
	AT extends BookPropertyType.LONG_TEXT ? string :
	AT extends BookPropertyType.EMAIL ? string :
	AT extends BookPropertyType.INTEGER ? number :
	AT extends BookPropertyType.FLOAT ? number :
	AT extends BookPropertyType.BINARY ? boolean :
	AT extends BookPropertyType.ENCRYPTED ? string :
	AT extends BookPropertyType.TIME ? Date :
	AT extends BookPropertyType.SET_STRING ? Array<string> :
	AT extends BookPropertyType.SET_NUMBER ? Array<number> :
	AT extends BookPropertyType.ENUM_STRING ? string :
	AT extends BookPropertyType.ENUM_NUMBER ? number :
	AT extends BookPropertyType.ATOM ? string :
	AT extends BookPropertyType.ATOM_ARRAY ? string[] :
	never;

export type Book = {
	[k:string]: Book.Definition
};

export namespace Book {
	
	export type Definition = {
		properties: Definition.Properties
		security?: BookSecurityType | Definition.Security
	}
	
	export namespace Definition {
		
		export type Security = {
			type: BookSecurityType,
			_r?: BookPropertyType.ID,
			_w?: BookPropertyType.ID
		}
		
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
			Property.Time |
			Property.SetString |
			Property.SetNumber |
			Property.EnumString |
			Property.EnumNumber |
			Property.Atom |
			Property.AtomArray;
		
		export namespace Property {
		
			interface SharedFields {
				type: BookPropertyType,
				label: string,
				optional?: boolean,
				unique?: boolean,
				default?: any,
				on_error?: (old_value: any) => any
			}
			
			export interface ID extends SharedFields {
				type: BookPropertyType.ID,
				validation?: Validation.String
			}
			
			export interface Text extends SharedFields {
				type: BookPropertyType.TEXT,
				validation?: Validation.String
			}
			
			export interface LongText extends SharedFields {
				type: BookPropertyType.LONG_TEXT,
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
			
			export interface Email extends SharedFields {
				type: BookPropertyType.EMAIL
			}
			
			export interface Integer extends SharedFields {
				type: BookPropertyType.INTEGER,
				validation?: Validation.Number
			}
			
			export interface Float extends SharedFields {
				type: BookPropertyType.FLOAT,
				validation?: Validation.Number
				format?: Format.Float
			}
			
			export interface Binary extends SharedFields {
				type: BookPropertyType.BINARY
				default?: false | true,
				values?: [string, string]
			}
			
			export interface Encrypted extends SharedFields {
				type: BookPropertyType.ENCRYPTED,
				validation?: Validation.String
			}
			
			export interface Time extends SharedFields {
				type: BookPropertyType.TIME,
				default?: Date | 'NOW',
				validation?: Validation.Time
			}
			
			export interface EnumString extends SharedFields {
				type: BookPropertyType.ENUM_STRING,
				values: string[],
				default?: string
			}
			
			export interface EnumNumber extends SharedFields {
				type: BookPropertyType.ENUM_NUMBER,
				values: number[],
				default?: number
			}
			
			export interface SetString extends SharedFields {
				type: BookPropertyType.SET_STRING,
				validation?: Validation.SetString
			}
			
			export interface SetNumber extends SharedFields {
				type: BookPropertyType.SET_NUMBER,
				validation?: Validation.SetNumber
			}
			
			export interface Atom extends SharedFields {
				type: BookPropertyType.ATOM,
				atom: AtomName,
				validation?: Validation.Atom
			}
			
			export interface AtomArray extends SharedFields {
				type: BookPropertyType.ATOM_ARRAY,
				atom: AtomName,
				validation?: Validation.Atom
			}
			
			export namespace Format {
				
				export interface Float {
					decimal?: number,
					decimal_point?: string,
					thousands_step?: string
				}
				
			}
			
			export namespace Validation {
				
				export interface String {
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
				
				export interface Number {
					min?: number,
					max?: number,
					eq?: number
				}
				
				export interface Time {
					min?: Date,
					max?: Date,
					eq?: Date
				}
				
				export interface SetString {
					min?: number,
					max?: number,
					length?: number
					values?: string[],
				}
				
				export interface SetNumber {
					min?: number,
					max?: number,
					length?: number
					values?: number[],
				}
				
				export interface Atom {
					date_from?: Date,
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
