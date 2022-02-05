"use strict";
/**
 * Atom book
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_book = void 0;
// import schema from 'uranio-schema';
// import {schema} from './sch/';
const book_srv_1 = require("./typ/book_srv");
exports.atom_book = {
    superuser: {
        authenticate: true,
        plural: 'superusers',
        security: {
            type: "UNIFORM" /* UNIFORM */,
            _r: "NOBODY" /* NOBODY */
        },
        properties: {
            email: {
                type: book_srv_1.BookProperty.EMAIL,
                label: 'Email',
                unique: true,
                on_error: () => {
                    return 'email@email.com';
                }
            },
            password: {
                type: book_srv_1.BookProperty.ENCRYPTED,
                label: 'Password',
                hidden: true
            },
            groups: {
                type: book_srv_1.BookProperty.ATOM_ARRAY,
                atom: 'group',
                label: 'Groups',
                optional: true
            }
        },
        dock: {
            url: '/superusers',
            auth_url: '/superauth'
        }
    },
    user: {
        authenticate: true,
        plural: 'users',
        security: {
            type: "GRANULAR" /* GRANULAR */
        },
        properties: {
            email: {
                type: book_srv_1.BookProperty.EMAIL,
                label: 'Email',
                unique: true,
            },
            password: {
                type: book_srv_1.BookProperty.ENCRYPTED,
                label: 'Password',
                hidden: true
            },
            groups: {
                type: book_srv_1.BookProperty.ATOM_ARRAY,
                atom: 'group',
                label: 'Groups',
                optional: true
            }
        },
        dock: {
            url: '/users',
            auth_url: '/auth'
        }
    },
    group: {
        plural: 'groups',
        properties: {
            name: {
                type: book_srv_1.BookProperty.TEXT,
                unique: true,
                label: 'Name'
            }
        },
        dock: {
            url: '/groups'
        }
    },
    media: {
        plural: 'media',
        properties: {
            src: {
                type: book_srv_1.BookProperty.TEXT,
                label: 'SRC',
            },
            filename: {
                primary: true,
                type: book_srv_1.BookProperty.TEXT,
                label: 'Filename'
            },
            type: {
                type: book_srv_1.BookProperty.TEXT,
                label: 'Filetype'
            },
            size: {
                type: book_srv_1.BookProperty.INTEGER,
                label: 'Size (byte)',
                validation: {
                    min: 0
                }
            },
            width: {
                optional: true,
                type: book_srv_1.BookProperty.INTEGER,
                label: 'Width',
                validation: {
                    min: 0
                }
            },
            height: {
                optional: true,
                type: book_srv_1.BookProperty.INTEGER,
                label: 'Height',
                validation: {
                    min: 0
                }
            }
        },
        dock: {
            url: '/media'
        }
    }
};
//# sourceMappingURL=book.js.map