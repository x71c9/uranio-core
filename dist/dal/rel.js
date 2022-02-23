"use strict";
/**
 * Class for Main Data Access Layer
 *
 * This class will select the Relation the DAL should use.
 * Check the type of DB defined in the config.
 * Use a Log Relation if the Atom has the `connection` property set to `log`.
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
exports.create_main = exports.RelationDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONN_DAL', 'RelationDAL');
const urn_rel = __importStar(require("../rel/server"));
const book = __importStar(require("../book/server"));
const conf = __importStar(require("../conf/server"));
const basic_1 = require("./basic");
let RelationDAL = class RelationDAL extends basic_1.BasicDAL {
    constructor(atom_name) {
        let db_relation;
        switch (conf.get(`db_type`)) {
            case 'mongo': {
                const atom_def = book.get_definition(atom_name);
                switch (atom_def.connection) {
                    case 'log':
                        db_relation = urn_rel.mongo.log_create(atom_name);
                        break;
                    default:
                        db_relation = urn_rel.mongo.create(atom_name);
                }
                break;
            }
            default: {
                const err_msg = `The Database type in the configuration data is invalid.`;
                throw urn_exc.create('INVALID_DB_TYPE', err_msg);
            }
        }
        super(atom_name, db_relation);
    }
};
RelationDAL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], RelationDAL);
exports.RelationDAL = RelationDAL;
function create_main(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create RelationDAL [${atom_name}]`);
    return new RelationDAL(atom_name);
}
exports.create_main = create_main;
//# sourceMappingURL=rel.js.map