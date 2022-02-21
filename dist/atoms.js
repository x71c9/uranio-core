"use strict";
/**
 * Atom book
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_book = void 0;
// import schema from 'uranio-schema';
// import {schema} from './sch/index';
const book_cln_1 = require("./typ/book_cln");
exports.atom_book = {
    superuser: {
        authenticate: true,
        plural: 'superusers',
        security: {
            type: book_cln_1.SecurityType.UNIFORM,
            _r: book_cln_1.PermissionType.NOBODY
        },
        properties: {
            email: {
                type: book_cln_1.PropertyType.EMAIL,
                label: 'Email',
                unique: true,
                on_error: () => {
                    return 'email@email.com';
                }
            },
            password: {
                type: book_cln_1.PropertyType.ENCRYPTED,
                label: 'Password',
                hidden: true
            },
            groups: {
                type: book_cln_1.PropertyType.ATOM_ARRAY,
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
            type: book_cln_1.SecurityType.GRANULAR
        },
        properties: {
            email: {
                type: book_cln_1.PropertyType.EMAIL,
                label: 'Email',
                unique: true,
            },
            password: {
                type: book_cln_1.PropertyType.ENCRYPTED,
                label: 'Password',
                hidden: true
            },
            groups: {
                type: book_cln_1.PropertyType.ATOM_ARRAY,
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
                type: book_cln_1.PropertyType.TEXT,
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
                type: book_cln_1.PropertyType.TEXT,
                label: 'SRC',
            },
            filename: {
                primary: true,
                type: book_cln_1.PropertyType.TEXT,
                label: 'Filename'
            },
            type: {
                type: book_cln_1.PropertyType.TEXT,
                label: 'Filetype'
            },
            size: {
                type: book_cln_1.PropertyType.INTEGER,
                label: 'Size (byte)',
                validation: {
                    min: 0
                }
            },
            width: {
                optional: true,
                type: book_cln_1.PropertyType.INTEGER,
                label: 'Width',
                validation: {
                    min: 0
                }
            },
            height: {
                optional: true,
                type: book_cln_1.PropertyType.INTEGER,
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
//# sourceMappingURL=atoms.js.map