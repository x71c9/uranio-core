"use strict";
/**
 * Atom book
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_book = void 0;
const book_cln_1 = require("./typ/book_cln");
exports.atom_book = {
    _superuser: {
        authenticate: true,
        plural: '_superusers',
        security: {
            type: book_cln_1.SecurityType.UNIFORM,
            _r: book_cln_1.PermissionType.NOBODY
        },
        properties: {
            email: {
                type: book_cln_1.PropertyType.EMAIL,
                label: 'Email',
                unique: true,
                search: true,
                primary: true,
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
                atom: '_group',
                label: 'Groups',
                optional: true
            }
        },
        dock: {
            url: '/_superusers',
            auth_url: '/_superauth'
        }
    },
    _group: {
        plural: '_groups',
        properties: {
            name: {
                type: book_cln_1.PropertyType.TEXT,
                unique: true,
                primary: true,
                search: true,
                label: 'Name'
            }
        },
        dock: {
            url: '/_groups'
        }
    },
    _user: {
        authenticate: true,
        plural: '_users',
        security: {
            type: book_cln_1.SecurityType.GRANULAR
        },
        properties: {
            email: {
                type: book_cln_1.PropertyType.EMAIL,
                label: 'Email',
                search: true,
                primary: true,
                unique: true,
            },
            password: {
                type: book_cln_1.PropertyType.ENCRYPTED,
                label: 'Password',
                hidden: true
            },
            groups: {
                type: book_cln_1.PropertyType.ATOM_ARRAY,
                atom: '_group',
                label: 'Groups',
                optional: true
            }
        },
        dock: {
            url: '/_users',
            auth_url: '/auth'
        }
    },
    _media: {
        plural: '_media',
        properties: {
            src: {
                type: book_cln_1.PropertyType.TEXT,
                search: true,
                label: 'SRC',
            },
            filename: {
                primary: true,
                type: book_cln_1.PropertyType.TEXT,
                search: true,
                label: 'Filename'
            },
            type: {
                type: book_cln_1.PropertyType.TEXT,
                search: true,
                primary: true,
                label: 'Filetype'
            },
            size: {
                type: book_cln_1.PropertyType.INTEGER,
                label: 'Size (byte)',
                primary: true,
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
            url: '/_media'
        }
    }
};
//# sourceMappingURL=atom_book.js.map