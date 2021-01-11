"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_book = void 0;
const core_atoms_book = {
    superuser: {
        security: {
            type: "UNIFORM" /* UNIFORM */,
            _r: null
        },
        properties: {
            email: {
                type: "EMAIL" /* EMAIL */,
                label: 'Email',
                unique: true,
                on_error: () => {
                    return 'email@email.com';
                }
            },
            password: {
                type: "ENCRYPTED" /* ENCRYPTED */,
                label: 'Password'
            }
        }
    },
    user: {
        securiy: {
            type: "GRANULAR" /* GRANULAR */
        },
        properties: {
            email: {
                type: "EMAIL" /* EMAIL */,
                label: 'Email',
                unique: true,
            },
            password: {
                type: "ENCRYPTED" /* ENCRYPTED */,
                label: 'Password'
            },
            groups: {
                type: "ATOM_ARRAY" /* ATOM_ARRAY */,
                atom: 'group',
                label: 'Groups',
                optional: true
            }
        }
    },
    group: {
        properties: {
            name: {
                type: "TEXT" /* TEXT */,
                label: 'Name'
            }
        }
    }
};
exports.atom_book = Object.assign({}, core_atoms_book);
//# sourceMappingURL=book.js.map