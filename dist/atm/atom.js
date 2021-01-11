"use strict";
/**
 *
 * Module for general Atom class
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_atom = exports.Atom = void 0;
const urn_lib_1 = require("urn-lib");
/**
 * Class for general Atom
 */
let Atom = class Atom {
    constructor(resource) {
        this.validate(resource);
        if (urn_lib_1.urn_util.object.has_key(resource, '_id')) {
            this._id = resource._id;
        }
        if (urn_lib_1.urn_util.object.has_key(resource, '_deleted_from')) {
            this._deleted_from = resource._deleted_from;
        }
        if (urn_lib_1.urn_util.object.has_key(resource, 'date')) {
            this.date = resource.date;
        }
    }
    return() {
        const that = this;
        this.validate(that);
        const data_transfer_object = {};
        for (const key of this.get_keys().approved) {
            if (!this.get_keys().optional.has(key) && !urn_lib_1.urn_util.object.has_key(that, key)) {
                throw urn_lib_1.urn_error.create(`Cannot return(). Current instance has no property [${key}] set.`);
            }
            data_transfer_object[key] = that[key];
        }
        return data_transfer_object;
    }
    validate(resource) {
        if (typeof resource !== 'object' || resource === null) {
            const resource_type = (typeof resource === 'object') ? 'null' : typeof resource;
            let err_msg = `Invalid ${this.constructor.name} constructor initializer type.`;
            err_msg += ` Constructor initializer value must be of type "object" - given type [${resource_type}].`;
            throw urn_lib_1.urn_error.create(err_msg);
        }
        for (const key of this.get_keys().approved) {
            if (this.get_keys().optional.has(key))
                continue;
            if (!urn_lib_1.urn_util.object.has_key(resource, key)) {
                let err_msg = `Invalid ${this.constructor.name} constructor initializer.`;
                err_msg += ` Initializer is missing propery [${key}].`;
                throw urn_lib_1.urn_error.create(err_msg);
            }
        }
        const types = new Set(['boolean', 'number', 'string', 'object']);
        for (const t of types) {
            for (const key of this.get_keys()[t]) {
                if (this.get_keys().optional.has(key) && typeof resource[key] === typeof undefined)
                    continue;
                if (typeof resource[key] !== t) {
                    let err_msg = `Invalid initializer key type [${key}].`;
                    err_msg += ` Type must be "${t}" - given type [${typeof resource[key]}]`;
                    throw urn_lib_1.urn_error.create(err_msg);
                }
            }
        }
        for (const key of this.get_keys().date) {
            if (this.get_keys().optional.has(key) && typeof resource[key] === typeof undefined)
                continue;
            if (!urn_lib_1.urn_util.is_date(resource[key])) {
                let err_msg = `Invalid initializer key type [${key}].`;
                err_msg += ` Type must be "date" - given type [${typeof resource[key]}]`;
                throw urn_lib_1.urn_error.create(err_msg);
            }
        }
        return true;
    }
};
Atom = __decorate([
    urn_lib_1.urn_log.decorators.debug_methods
], Atom);
exports.Atom = Atom;
function create_atom(model_instance, atom_class) {
    urn_lib_1.urn_log.fn_debug(`Create ${atom_class.constructor.name}`);
    try {
        return new atom_class(model_instance);
    }
    catch (err) {
        throw urn_lib_1.urn_error.create(`Cannot create Atom [${atom_class.constructor.name}]. ` + err.message, err);
    }
}
exports.create_atom = create_atom;
//# sourceMappingURL=atom.js.map