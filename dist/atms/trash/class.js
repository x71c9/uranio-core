"use strict";
/**
 * Module for Atom User class
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
exports.Trash = exports.trash_keys = void 0;
const urn_lib_1 = require("urn-lib");
const atom_1 = require("../atom");
const types_1 = require("../types");
exports.trash_keys = types_1.models.trash.keys;
/**
 * Class for Atom User
 */
let Trash = class Trash extends atom_1.Atom {
    constructor(trash) {
        super(trash);
        this.record = trash.record;
    }
    _get_keys() {
        return exports.trash_keys;
    }
};
Trash = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], Trash);
exports.Trash = Trash;
//# sourceMappingURL=class.js.map