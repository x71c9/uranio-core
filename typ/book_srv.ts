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

import {BLL} from '../bll/bll';

import {AtomName} from './atom';

import {Passport} from './auth';

import {BookPropertyType} from './common';

import * as book_cln from './book_cln';

export const enum BookSecurityType {
	UNIFORM = 'UNIFORM',
	GRANULAR = 'GRANULAR'
}

export const enum BookPermissionType {
	NOBODY = 'NOBODY',
	PUBLIC = 'PUBLIC'
}

export type Book = {
	[k in AtomName]?: Book.Definition<k>;
}

export namespace Book {
	
	export type BasicDefinition =
		book_cln.Book.BasicDefinition & {
		security?: BookSecurityType | Definition.Security
	}
	
	export type Definition<A extends AtomName> =
		BasicDefinition &
		{ bll?: Definition.Bll<A>}
	
	export namespace Definition {
		
		export type Bll<A extends AtomName> = {
			class: (passport?:Passport) => BLL<A> ;
		}
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Dock = book_cln.Book.Definition.Dock;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Properties = book_cln.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Property = book_cln.Book.Definition.Property;
		
		export type Security = {
			type: BookSecurityType,
			_r?: BookPropertyType.ID | BookPermissionType.NOBODY
			_w?: BookPropertyType.ID | BookPermissionType.PUBLIC
		}
		
	}
	
}

