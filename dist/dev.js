"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Web run module
 *
 * @packageDocumentation
 */
const urn_lib_1 = require("urn-lib");
urn_lib_1.urn_log.init(urn_lib_1.urn_log.LogLevel.FUNCTION_DEBUG);
const server_1 = __importDefault(require("./server"));
server_1.default.init();
//# sourceMappingURL=dev.js.map