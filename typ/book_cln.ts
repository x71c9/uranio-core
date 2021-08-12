/**
 * Common
 *
 * @packageDocumentation
 */

import {AtomName} from './atom';

import {BookPropertyType} from './common';

export type Book = {
	[k in AtomName]?: Book.Definition;
}

export namespace Book {
	
	export type BasicDefinition = {
		properties: Definition.Properties
		plural?: string
		api?: Definition.Api
	}
	
	export type Definition =
		BasicDefinition
	
	export namespace Definition {
		
		export type Api = {
			auth?: string
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
		
			export interface SharedFields {
				type: BookPropertyType,
				label: string,
				optional?: boolean,
				hidden?: boolean,
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
				delete_cascade?: boolean,
				validation?: Validation.Atom
			}
			
			export interface AtomArray extends SharedFields {
				type: BookPropertyType.ATOM_ARRAY,
				atom: AtomName,
				delete_cascade?: boolean,
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


