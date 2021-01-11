import { AtomPropertyType } from './types';
export declare const atom_book: {
    readonly product: {
        readonly properties: {
            readonly _id: {
                readonly type: AtomPropertyType.INTEGER;
                readonly label: "_id";
            };
            readonly title: {
                readonly type: AtomPropertyType.TEXT;
                readonly label: "Title";
                readonly required: true;
            };
        };
        readonly mongo_schema: {};
    };
    readonly superuser: {
        readonly properties: {
            readonly email: {
                readonly type: AtomPropertyType.EMAIL;
                readonly label: "Email";
                readonly required: true;
            };
            readonly password: {
                readonly type: AtomPropertyType.ENCRYPTED;
                readonly label: "Email";
                readonly required: true;
            };
        };
        readonly mongo_schema: {};
    };
};
