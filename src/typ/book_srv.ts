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

import {schema} from '../sch/index';

import {BLL} from '../bll/bll';

import {Passport} from './auth';

import {PropertyType, SecurityType, PermissionType} from './book_cln';

export {PropertyType, SecurityType, PermissionType};

import * as book_cln from './book_cln';

export type Book = {
	[A in schema.AtomName]: Book.Definition<A>;
}

export namespace Book {
	
	export type Definition<A extends schema.AtomName> =
		book_cln.Book.Definition & {
		security?: SecurityType | Definition.Security
		bll?: Definition.Bll<A>
	}
	
	export namespace Definition {
		
		export type Bll<A extends schema.AtomName> = {
			class: (passport?:Passport) => BLL<A> ;
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
			type: SecurityType,
			_r?: PropertyType.ID | PermissionType.NOBODY
			_w?: PropertyType.ID | PermissionType.PUBLIC
		}
		
	}
	
}

