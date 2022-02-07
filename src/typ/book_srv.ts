/**
 * Server Book types module
 *
 * This module defines the type of the `atom_book` for the Server.
 * It extends the defintion of the Client Book type.
 *
 * In order to copy and reexport namespaces and types we use the syntax
 * `export import`.
 *
 * `type Book` must be redifined.
 *
 * @packageDocumentation
 */

// import schema from 'uranio-schema';

import {schema} from '../sch/';

import {BLL} from '../bll/bll';

// import {schema.AtomName} from './atom';

import {Passport} from './auth';

import {BookProperty} from './book_cln';

export {BookProperty};

import * as book_cln from './book_cln';

export enum BookSecurity {
	UNIFORM = 'UNIFORM',
	GRANULAR = 'GRANULAR'
}

export enum BookPermission {
	NOBODY = 'NOBODY',
	PUBLIC = 'PUBLIC'
}

export type Book = {
	[k:string]: Book.Definition;
}

// export type BllBook = {
//   [k in schema.AtomName]: Book.Definition.Bll<k>
// }

export namespace Book {
	
	// export type BasicDefinition =
	//   book_cln.Book.BasicDefinition & {
	//   security?: BookSecurityType | Definition.Security
	// }
	
	export type Definition =
		book_cln.Book.Definition & {
		security?: BookSecurity | Definition.Security
		bll?: Definition.Bll
	}
	
	export namespace Definition {
		
		export type Bll = {
			class: <A extends schema.AtomName>(passport?:Passport) => BLL<A> ;
		}
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Properties = book_cln.Book.Definition.Properties;
		
		export type Properties = book_cln.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Property = book_cln.Book.Definition.Property;
		
		export type Property = book_cln.Book.Definition.Property;
		
		export namespace Property {
			
			export type SharedFields = book_cln.Book.Definition.Property.SharedFields;
			
			export type ID = book_cln.Book.Definition.Property.ID;
			export type Text = book_cln.Book.Definition.Property.Text;
			export type LongText = book_cln.Book.Definition.Property.LongText;
			export type String = book_cln.Book.Definition.Property.String;
			export type Number = book_cln.Book.Definition.Property.Number;
			export type Enum = book_cln.Book.Definition.Property.Enum;
			export type Set = book_cln.Book.Definition.Property.Set;
			export type DayTime = book_cln.Book.Definition.Property.DayTime;
			export type Email = book_cln.Book.Definition.Property.Email;
			export type Integer = book_cln.Book.Definition.Property.Integer;
			export type Float = book_cln.Book.Definition.Property.Float;
			export type Binary = book_cln.Book.Definition.Property.Binary;
			export type Encrypted = book_cln.Book.Definition.Property.Encrypted;
			export type Day = book_cln.Book.Definition.Property.Day;
			export type Time = book_cln.Book.Definition.Property.Time;
			export type EnumString = book_cln.Book.Definition.Property.EnumString;
			export type EnumNumber = book_cln.Book.Definition.Property.EnumNumber;
			export type SetString = book_cln.Book.Definition.Property.SetString;
			export type SetNumber = book_cln.Book.Definition.Property.SetNumber;
			export type Atom = book_cln.Book.Definition.Property.Atom;
			export type AtomArray = book_cln.Book.Definition.Property.AtomArray;
			
			export namespace Format {
				export type Float = book_cln.Book.Definition.Property.Format.Float;
			}
			
			export namespace Validation {
				export type String = book_cln.Book.Definition.Property.Validation.String;
				export type Number = book_cln.Book.Definition.Property.Validation.Number;
				export type DayTime = book_cln.Book.Definition.Property.Validation.DayTime;
				export type SetNumber = book_cln.Book.Definition.Property.Validation.SetNumber;
				export type SetString = book_cln.Book.Definition.Property.Validation.SetString;
				export type Atom = book_cln.Book.Definition.Property.Validation.Atom;
			}
			
		}
		
		export type Security = {
			type: BookSecurity,
			_r?: BookProperty.ID | BookPermission.NOBODY
			_w?: BookProperty.ID | BookPermission.PUBLIC
		}
		
	}
	
}

