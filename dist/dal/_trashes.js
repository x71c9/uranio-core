"use strict";
/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const urn_lib_1 = require("urn-lib");
const abstract_1 = require("./abstract");
const urn_atm = __importStar(require("../atm/"));
const urn_rel = __importStar(require("../rel/"));
let DALTrashes = class DALTrashes extends abstract_1.DAL {
    constructor(db_type) {
        super(db_type, urn_atm.trash.module);
        switch (this.db_type) {
            case 'mongo':
                this._db_relation = urn_rel.mongo.trash.create();
                break;
            case 'mysql':
                break;
        }
        // Because MySQL is not implemented yet
        this._db_relation = urn_rel.mongo.trash.create();
    }
};
DALTrashes = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], DALTrashes);
function create(db_type) {
    urn_lib_1.urn_log.fn_debug(`Create DALTrashes Users`);
    return new DALTrashes(db_type);
}
exports.create = create;
//# sourceMappingURL=_trashes.js.map