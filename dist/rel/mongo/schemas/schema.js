"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_schema_definition = void 0;
exports.user_schema_definition = {
    first_name: {
        type: String,
        trim: true,
        match: /^[a-zA-z -]+$/,
        set: (v) => (v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1) {
            return $1.toUpperCase();
        }),
        minlenght: 2,
        maxlenght: 255,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        match: /^[a-zA-z -]+$/,
        set: (v) => (v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1) {
            return $1.toUpperCase();
        }),
        minlenght: 2,
        maxlenght: 255,
        required: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^[a-z0-9_-]+$/,
        minlenght: 3,
        maxlenght: 255,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        maxlenght: 255,
        unique: true,
        required: true
    },
    type: {
        type: String,
        default: 'default',
        enum: ['default', 'pro'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        match: /^[^ \t\r+]+$/,
        minlenght: 8,
        maxlenght: 255,
        required: true
    },
    creation_date: {
        type: Date,
        required: true
    }
};
//# sourceMappingURL=schema.js.map