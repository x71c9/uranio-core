/**
 * Atom book
 *
 * @packageDocumentation
 */
import { BookProperty, BookSecurity, BookPermission } from './typ/book_srv';
export declare const atom_book: {
    readonly superuser: {
        readonly authenticate: true;
        readonly plural: "superusers";
        readonly security: {
            readonly type: BookSecurity.UNIFORM;
            readonly _r: BookPermission.NOBODY;
        };
        readonly properties: {
            readonly email: {
                readonly type: BookProperty.EMAIL;
                readonly label: "Email";
                readonly unique: true;
                readonly on_error: () => string;
            };
            readonly password: {
                readonly type: BookProperty.ENCRYPTED;
                readonly label: "Password";
                readonly hidden: true;
            };
            readonly groups: {
                readonly type: BookProperty.ATOM_ARRAY;
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
            readonly type: BookSecurity.GRANULAR;
        };
        readonly properties: {
            readonly email: {
                readonly type: BookProperty.EMAIL;
                readonly label: "Email";
                readonly unique: true;
            };
            readonly password: {
                readonly type: BookProperty.ENCRYPTED;
                readonly label: "Password";
                readonly hidden: true;
            };
            readonly groups: {
                readonly type: BookProperty.ATOM_ARRAY;
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
                readonly type: BookProperty.TEXT;
                readonly unique: true;
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
                readonly type: BookProperty.TEXT;
                readonly label: "SRC";
            };
            readonly filename: {
                readonly primary: true;
                readonly type: BookProperty.TEXT;
                readonly label: "Filename";
            };
            readonly type: {
                readonly type: BookProperty.TEXT;
                readonly label: "Filetype";
            };
            readonly size: {
                readonly type: BookProperty.INTEGER;
                readonly label: "Size (byte)";
                readonly validation: {
                    readonly min: 0;
                };
            };
            readonly width: {
                readonly optional: true;
                readonly type: BookProperty.INTEGER;
                readonly label: "Width";
                readonly validation: {
                    readonly min: 0;
                };
            };
            readonly height: {
                readonly optional: true;
                readonly type: BookProperty.INTEGER;
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
