"use strict";
/**
 * Main module for server
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
exports.conf = exports.db = exports.book = exports.atm = exports.bll = exports.types = void 0;
const types = __importStar(require("./types"));
exports.types = types;
__exportStar(require("../sch/"), exports);
const bll = __importStar(require("../bll/"));
exports.bll = bll;
const atm = __importStar(require("../atm/"));
exports.atm = atm;
const book = __importStar(require("../book/"));
exports.book = book;
const db = __importStar(require("../db/"));
exports.db = db;
const conf = __importStar(require("../conf/"));
exports.conf = conf;
/*
 * First level methods.
 * If other methods are added, urn-cli must be updated.
 * Go to urn-cli/src/cmd/transpose.ts and
 * add the new method names.
 */
__exportStar(require("../init/"), exports);
__exportStar(require("../reg/"), exports);
//# sourceMappingURL=main.js.map