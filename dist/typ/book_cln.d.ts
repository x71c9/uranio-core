/**
 * Client Book types module
 *
 * This module defines the type of the `atom_book` for the Client.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/';
export declare type ConnectionName = 'main' | 'trash' | 'log';
export declare enum BookProperty {
    ID = "ID",
    TEXT = "TEXT",
    LONG_TEXT = "LONG_TEXT",
    EMAIL = "EMAIL",
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    BINARY = "BINARY",
    ENCRYPTED = "ENCRYPTED",
    DAY = "DAY",
    TIME = "TIME",
    ENUM_STRING = "ENUM_STRING",
    ENUM_NUMBER = "ENUM_NUMBER",
    SET_STRING = "SET_STRING",
    SET_NUMBER = "SET_NUMBER",
    ATOM = "ATOM",
    ATOM_ARRAY = "ATOM_ARRAY"
}
export declare type Book = {
    [k: string]: Book.Definition;
};
export declare namespace Book {
    type Definition = {
        properties: Definition.Properties;
        authenticate?: boolean;
        connection?: ConnectionName;
        plural?: string;
    };
    namespace Definition {
        type Properties = {
            [k: string]: Property;
        };
        type Property = Property.ID | Property.Text | Property.LongText | Property.Email | Property.Integer | Property.Float | Property.Binary | Property.Encrypted | Property.Day | Property.Time | Property.SetString | Property.SetNumber | Property.EnumString | Property.EnumNumber | Property.Atom | Property.AtomArray;
        namespace Property {
            interface SharedFields {
                type: BookProperty;
                label: string;
                optional?: boolean;
                hidden?: boolean;
                unique?: boolean;
                default?: any;
                on_error?: (old_value: any) => any;
            }
            interface ID extends SharedFields {
                type: BookProperty.ID;
                validation?: Validation.String;
            }
            interface Text extends SharedFields {
                type: BookProperty.TEXT;
                validation?: Validation.String;
            }
            interface LongText extends SharedFields {
                type: BookProperty.LONG_TEXT;
                validation?: Validation.String;
            }
            type String = Text | LongText | Encrypted;
            type Number = Integer | Float;
            type Enum = EnumString | EnumNumber;
            type Set = SetString | SetNumber;
            type DayTime = Day | Time;
            interface Email extends SharedFields {
                type: BookProperty.EMAIL;
            }
            interface Integer extends SharedFields {
                type: BookProperty.INTEGER;
                validation?: Validation.Number;
            }
            interface Float extends SharedFields {
                type: BookProperty.FLOAT;
                validation?: Validation.Number;
                format?: Format.Float;
            }
            interface Binary extends SharedFields {
                type: BookProperty.BINARY;
                default?: false | true;
                values?: [string, string];
            }
            interface Encrypted extends SharedFields {
                type: BookProperty.ENCRYPTED;
                validation?: Validation.String;
            }
            interface Day extends SharedFields {
                type: BookProperty.DAY;
                default?: Date | 'NOW';
                validation?: Validation.DayTime;
            }
            interface Time extends SharedFields {
                type: BookProperty.TIME;
                default?: Date | 'NOW';
                validation?: Validation.DayTime;
            }
            interface EnumString extends SharedFields {
                type: BookProperty.ENUM_STRING;
                values: string[];
                default?: string;
            }
            interface EnumNumber extends SharedFields {
                type: BookProperty.ENUM_NUMBER;
                values: number[];
                default?: number;
            }
            interface SetString extends SharedFields {
                type: BookProperty.SET_STRING;
                validation?: Validation.SetString;
            }
            interface SetNumber extends SharedFields {
                type: BookProperty.SET_NUMBER;
                validation?: Validation.SetNumber;
            }
            interface Atom extends SharedFields {
                type: BookProperty.ATOM;
                atom: schema.AtomName;
                delete_cascade?: boolean;
                validation?: Validation.Atom;
            }
            interface AtomArray extends SharedFields {
                type: BookProperty.ATOM_ARRAY;
                atom: schema.AtomName;
                delete_cascade?: boolean;
                validation?: Validation.Atom;
            }
            namespace Format {
                interface Float {
                    decimal?: number;
                    decimal_point?: string;
                    thousands_step?: string;
                }
            }
            namespace Validation {
                interface String {
                    alphanum?: boolean;
                    contain_digit?: boolean;
                    contain_lowercase?: boolean;
                    contain_uppercase?: boolean;
                    length?: number;
                    lowercase?: boolean;
                    max?: number;
                    min?: number;
                    only_letters?: boolean;
                    only_numbers?: boolean;
                    reg_ex?: RegExp;
                    uppercase?: boolean;
                }
                interface Number {
                    min?: number;
                    max?: number;
                    eq?: number;
                }
                interface DayTime {
                    min?: Date;
                    max?: Date;
                    eq?: Date;
                }
                interface SetString {
                    min?: number;
                    max?: number;
                    length?: number;
                    values?: string[];
                }
                interface SetNumber {
                    min?: number;
                    max?: number;
                    length?: number;
                    values?: number[];
                }
                interface Atom {
                    date_from?: Date;
                    date_until?: Date;
                }
            }
        }
    }
}
