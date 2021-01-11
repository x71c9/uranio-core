"use strict";
// import mongoose from 'mongoose';
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_book = void 0;
const core_atoms_book = {
    superuser: {
        properties: {
            email: {
                type: "EMAIL" /* EMAIL */,
                label: 'Email',
                required: true
            },
            password: {
                type: "ENCRYPTED" /* ENCRYPTED */,
                label: 'Email',
                required: true
            }
        },
        mongo_schema: {}
    }
};
exports.atom_book = Object.assign(Object.assign({}, core_atoms_book), { product: {
        properties: {
            _id: {
                type: "INTEGER" /* INTEGER */,
                label: '_id'
            },
            title: {
                type: "TEXT" /* TEXT */,
                label: 'Title',
                required: true
            }
        },
        mongo_schema: {}
    } });
//# sourceMappingURL=urn.config.js.map