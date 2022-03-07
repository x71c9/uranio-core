"use strict";
/**
 * Main module for server
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.required = exports.register = exports.stc = exports.log = exports.util = exports.env = exports.conf = exports.db = exports.book = exports.atom = exports.bll = exports.types = void 0;
const types = __importStar(require("./types"));
exports.types = types;
const bll = __importStar(require("../bll/server"));
exports.bll = bll;
const atom = __importStar(require("../atm/server"));
exports.atom = atom;
const book = __importStar(require("../book/server"));
exports.book = book;
const db = __importStar(require("../db/server"));
exports.db = db;
const conf = __importStar(require("../conf/server"));
exports.conf = conf;
const env = __importStar(require("../env/server"));
exports.env = env;
const util = __importStar(require("../util/server"));
exports.util = util;
const log = __importStar(require("../log/server"));
exports.log = log;
const stc = __importStar(require("../stc/server"));
exports.stc = stc;
const register = __importStar(require("../reg/server"));
exports.register = register;
const required = __importStar(require("../req/server"));
exports.required = required;
__exportStar(require("../sch/server"), exports);
__exportStar(require("../init/server"), exports);
//# sourceMappingURL=main.js.map