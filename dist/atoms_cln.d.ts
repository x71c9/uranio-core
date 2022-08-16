/**
 * Atom client book
 *
 * @packageDocumentation
 */
import { PropertyType, SecurityType, PermissionType } from './typ/book_cln';
export declare const atom_book: {
    readonly superuser: {
        readonly authenticate: true;
        readonly plural: "superusers";
        readonly security: {
            readonly type: SecurityType.UNIFORM;
            readonly _r: PermissionType.NOBODY;
        };
        readonly properties: {
            readonly email: {
                readonly type: PropertyType.EMAIL;
                readonly label: "Email";
                readonly unique: true;
                readonly search: true;
                readonly primary: true;
                readonly on_error: () => string;
            };
            readonly password: {
                readonly type: PropertyType.ENCRYPTED;
                readonly label: "Password";
                readonly hidden: true;
            };
            readonly groups: {
                readonly type: PropertyType.ATOM_ARRAY;
                readonly atom: "group";
                readonly label: "Groups";
                readonly optional: true;
            };
        };
        readonly dock: {
            readonly url: "/superusers";
            readonly auth_url: "/superauth";
        };
    };
    readonly user: {
        readonly authenticate: true;
        readonly plural: "users";
        readonly security: {
            readonly type: SecurityType.GRANULAR;
        };
        readonly properties: {
            readonly email: {
                readonly type: PropertyType.EMAIL;
                readonly label: "Email";
                readonly search: true;
                readonly primary: true;
                readonly unique: true;
            };
            readonly password: {
                readonly type: PropertyType.ENCRYPTED;
                readonly label: "Password";
                readonly hidden: true;
            };
            readonly groups: {
                readonly type: PropertyType.ATOM_ARRAY;
                readonly atom: "group";
                readonly label: "Groups";
                readonly optional: true;
            };
        };
        readonly dock: {
            readonly url: "/users";
            readonly auth_url: "/auth";
        };
    };
    readonly group: {
        readonly plural: "groups";
        readonly properties: {
            readonly name: {
                readonly type: PropertyType.TEXT;
                readonly unique: true;
                readonly primary: true;
                readonly search: true;
                readonly label: "Name";
            };
        };
        readonly dock: {
            readonly url: "/groups";
        };
    };
    readonly media: {
        readonly plural: "media";
        readonly properties: {
            readonly src: {
                readonly type: PropertyType.TEXT;
                readonly search: true;
                readonly label: "SRC";
            };
            readonly filename: {
                readonly primary: true;
                readonly type: PropertyType.TEXT;
                readonly search: true;
                readonly label: "Filename";
            };
            readonly type: {
                readonly type: PropertyType.TEXT;
                readonly search: true;
                readonly primary: true;
                readonly label: "Filetype";
            };
            readonly size: {
                readonly type: PropertyType.INTEGER;
                readonly label: "Size (byte)";
                readonly primary: true;
                readonly validation: {
                    readonly min: 0;
                };
            };
            readonly width: {
                readonly optional: true;
                readonly type: PropertyType.INTEGER;
                readonly label: "Width";
                readonly validation: {
                    readonly min: 0;
                };
            };
            readonly height: {
                readonly optional: true;
                readonly type: PropertyType.INTEGER;
                readonly label: "Height";
                readonly validation: {
                    readonly min: 0;
                };
            };
        };
        readonly dock: {
            readonly url: "/media";
        };
    };
};
