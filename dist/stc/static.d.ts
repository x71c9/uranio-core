/**
 * Static types module
 *
 * This modules defines all the static definitions
 *
 * @packageDocumentation
 */
import { BookProperty } from '../typ/book_cln';
export declare const atom_hard_properties: {
    readonly _id: {
        readonly type: BookProperty.ID;
        readonly label: "_id";
    };
    readonly _date: {
        readonly type: BookProperty.TIME;
        readonly label: "_date";
        readonly default: "NOW";
        readonly on_error: () => Date;
    };
};
export declare const atom_common_properties: {
    readonly _r: {
        readonly type: BookProperty.ID;
        readonly label: "_r";
        readonly optional: true;
    };
    readonly _w: {
        readonly type: BookProperty.ID;
        readonly label: "_w";
        readonly optional: true;
    };
    readonly _deleted_from: {
        readonly type: BookProperty.ID;
        readonly label: "Deleted from";
        readonly optional: true;
    };
};
export declare const abstract_passport: {
    readonly _id: "string";
    readonly auth_atom_name: "string";
    readonly groups: "string[]";
};
export declare const real_book_property_type: {
    readonly ID: "string";
    readonly TEXT: "string";
    readonly LONG_TEXT: "string";
    readonly EMAIL: "string";
    readonly INTEGER: "number";
    readonly FLOAT: "number";
    readonly BINARY: "boolean";
    readonly ENCRYPTED: "string";
    readonly DAY: "datetime";
    readonly TIME: "datetime";
    readonly ENUM_STRING: "string";
    readonly ENUM_NUMBER: "number";
    readonly SET_STRING: "string[]";
    readonly SET_NUMBER: "number[]";
    readonly ATOM: "object";
    readonly ATOM_ARRAY: "object[]";
};
