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
// const bll = uranio.bll.basic.create('superuser');
// bll.search('andr').then((a) => {
// 	console.log(a);
// });
// const bll = uranio.bll.basic.create('error');
// bll.find_by_id('625bddfde2f65c4d52a57892', {depth: 1}).then((a) => {
// 	console.log(a);
// });
// bll.find_by_id('61e9980a5bea5d4f9044f19b', {depth: 1}).then((a) => {
// 	console.log(a);
// });
// bll.update_by_id('61e9980a5bea5d4f9044f19b', {email: 'v@a.com'}, {depth: 1}).then((a) => {
// 	console.log(a);
// });
//# sourceMappingURL=dev.js.map