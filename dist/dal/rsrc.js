"use strict";
/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DALResources = void 0;
const urn_lib_1 = require("urn-lib");
const abstract_1 = require("./abstract");
let DALResources = class DALResources extends abstract_1.DAL {
    constructor(db_type, atom_module) {
        super(db_type, atom_module);
    }
    delete_one(atom) {
        const _super = Object.create(null, {
            delete_one: { get: () => super.delete_one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.delete_one.call(this, atom);
        });
    }
};
DALResources = __decorate([
    urn_lib_1.urn_log.decorators.debug_methods
], DALResources);
exports.DALResources = DALResources;
//# sourceMappingURL=rsrc.js.map