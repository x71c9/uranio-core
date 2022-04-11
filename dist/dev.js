"use strict";
/**
 * Core dev module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
server_1.default.init();
const bll = server_1.default.bll.basic.create('superuser');
bll.search('uranio').then((a) => {
    console.log(a);
});
//# sourceMappingURL=dev.js.map