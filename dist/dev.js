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
// import {atom_book} from './atoms';
// import * as book from './book/server';
// book.add_bll_definition('user', {
//   class: (passport?:uranio.types.Passport) => {
//     return new MyClass(passport);
//   }
// });
// class MyClass extends uranio.bll.BLL<'user'> {
//   constructor(passport?:uranio.types.Passport){
//     super('user', passport);
//   }
// }
// book.add_definition('user', {
//   authenticate: false,
//   properties:{
//     title: {
//       type: uranio.types.PropertyType.TEXT,
//       label: 'Title'
//     }
//   }
// });
// console.log(atom_book);
//# sourceMappingURL=dev.js.map