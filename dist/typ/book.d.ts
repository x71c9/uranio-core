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
import { schema } from '../sch/server';
import { BLL } from '../bll/bll';
import { Passport } from './auth';
import { PropertyType, SecurityType, PermissionType, ConnectionName } from './book_cln';
export { PropertyType, SecurityType, PermissionType, ConnectionName };
import * as book_cln from './book_cln';
export declare type Book = {
    [A in schema.AtomName]: Book.Definition<A>;
};
export declare namespace Book {
    type Definition<A extends schema.AtomName> = book_cln.Book.Definition & {
        bll?: Definition.Bll<A>;
    };
    namespace Definition {
        type Bll<A extends schema.AtomName> = {
            class: (passport?: Passport) => BLL<A>;
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
    }
}
