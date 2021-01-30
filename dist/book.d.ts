import { BookPropertyType, BookSecurityType } from './core/types';
export declare const atom_book: {
    readonly superuser: {
        readonly security: {
            readonly type: BookSecurityType.UNIFORM;
            readonly _r: null;
        };
        readonly properties: {
            readonly email: {
                readonly type: BookPropertyType.EMAIL;
                readonly label: "Email";
                readonly unique: true;
                readonly on_error: () => string;
            };
            readonly password: {
                readonly type: BookPropertyType.ENCRYPTED;
                readonly label: "Password";
            };
        };
    };
    readonly user: {
        readonly securiy: {
            readonly type: BookSecurityType.GRANULAR;
        };
        readonly properties: {
            readonly email: {
                readonly type: BookPropertyType.EMAIL;
                readonly label: "Email";
                readonly unique: true;
            };
            readonly password: {
                readonly type: BookPropertyType.ENCRYPTED;
                readonly label: "Password";
            };
            readonly groups: {
                readonly type: BookPropertyType.ATOM_ARRAY;
                readonly atom: "group";
                readonly label: "Groups";
                readonly optional: true;
            };
        };
    };
    readonly group: {
        readonly properties: {
            readonly name: {
                readonly type: BookPropertyType.TEXT;
                readonly label: "Name";
            };
        };
    };
};
