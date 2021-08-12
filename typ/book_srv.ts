/**
 *
 * Book types module
 *
 * This module defines the type of the `atom_book` defined in `urn_book`
 *
 * @packageDocumentation
 */

import {BLL} from '../bll/bll';

import {AtomName} from './atom';

export type ConnectionName = 'main' | 'trash' | 'log';

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

export type Book = book_cln.Book

export namespace Book {
	
	export type BasicDefinition =
		book_cln.Book.BasicDefinition & {
		connection?: ConnectionName
		security?: BookSecurityType | Definition.Security
	}
	
	export type Definition<A extends AtomName> =
		BasicDefinition &
		{ bll?: (passport?:Passport) => BLL<A> }
	
	export namespace Definition {
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Api = book_cln.Book.Definition.Api;
		
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
