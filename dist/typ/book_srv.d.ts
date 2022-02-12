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
import { schema } from '../sch/index';
import { BLL } from '../bll/bll';
import { Passport } from './auth';
import { BookProperty } from './book_cln';
export { BookProperty };
import * as book_cln from './book_cln';
export declare enum BookSecurity {
    UNIFORM = "UNIFORM",
    GRANULAR = "GRANULAR"
}
export declare enum BookPermission {
    NOBODY = "NOBODY",
    PUBLIC = "PUBLIC"
}
export declare type Book = {
    [k: string]: Book.Definition;
};
export declare namespace Book {
    type Definition = book_cln.Book.Definition & {
        security?: BookSecurity | Definition.Security;
        bll?: Definition.Bll;
    };
    namespace Definition {
        type Bll = {
            class: <A extends schema.AtomName>(passport?: Passport) => BLL<A>;
        };
        type Properties = book_cln.Book.Definition.Properties;
        type Property = book_cln.Book.Definition.Property;
        namespace Property {
            type SharedFields = book_cln.Book.Definition.Property.SharedFields;
            type ID = book_cln.Book.Definition.Property.ID;
            type Text = book_cln.Book.Definition.Property.Text;
            type LongText = book_cln.Book.Definition.Property.LongText;
            type String = book_cln.Book.Definition.Property.String;
            type Number = book_cln.Book.Definition.Property.Number;
            type Enum = book_cln.Book.Definition.Property.Enum;
            type Set = book_cln.Book.Definition.Property.Set;
            type DayTime = book_cln.Book.Definition.Property.DayTime;
            type Email = book_cln.Book.Definition.Property.Email;
            type Integer = book_cln.Book.Definition.Property.Integer;
            type Float = book_cln.Book.Definition.Property.Float;
            type Binary = book_cln.Book.Definition.Property.Binary;
            type Encrypted = book_cln.Book.Definition.Property.Encrypted;
            type Day = book_cln.Book.Definition.Property.Day;
            type Time = book_cln.Book.Definition.Property.Time;
            type EnumString = book_cln.Book.Definition.Property.EnumString;
            type EnumNumber = book_cln.Book.Definition.Property.EnumNumber;
            type SetString = book_cln.Book.Definition.Property.SetString;
            type SetNumber = book_cln.Book.Definition.Property.SetNumber;
            type Atom = book_cln.Book.Definition.Property.Atom;
            type AtomArray = book_cln.Book.Definition.Property.AtomArray;
            namespace Format {
                type Float = book_cln.Book.Definition.Property.Format.Float;
            }
            namespace Validation {
                type String = book_cln.Book.Definition.Property.Validation.String;
                type Number = book_cln.Book.Definition.Property.Validation.Number;
                type DayTime = book_cln.Book.Definition.Property.Validation.DayTime;
                type SetNumber = book_cln.Book.Definition.Property.Validation.SetNumber;
                type SetString = book_cln.Book.Definition.Property.Validation.SetString;
                type Atom = book_cln.Book.Definition.Property.Validation.Atom;
            }
        }
        type Security = {
            type: BookSecurity;
            _r?: BookProperty.ID | BookPermission.NOBODY;
            _w?: BookProperty.ID | BookPermission.PUBLIC;
        };
    }
}
