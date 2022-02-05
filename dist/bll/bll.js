"use strict";
/**
 * Default Class for Business Logic Layer
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
exports.BLL = void 0;
const urn_lib_1 = require("urn-lib");
const auth_1 = require("./auth");
let BLL = class BLL extends auth_1.AuthBLL {
};
BLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], BLL);
exports.BLL = BLL;
/**
 * Class @decorator function for loggin constructor with arguments
 *
 * @param log_instance - the log instance that will be used for logging
 */
// eslint-disable-next-line @typescript-eslint/ban-types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export function extend_class<A extends schema.AtomName>(atom_name:A){
//   return <T extends {new (...constr_args:any[]):any}>(constr_func: T): {new (...args:any[]):BLL<A>} => {
//     const ExtClass = class extends BLL<A> implements BLL<A>{
//       constructor(...args:any[]){
//         super(atom_name, ...args);
//       }
//     };
//     // console.log(constr_func);
//     // const ExtClass = new BLL<A>(atom_name);
//     for(const property_name of Object.getOwnPropertyNames(constr_func)){
//       const descriptor = Object.getOwnPropertyDescriptor(constr_func, property_name)!;
//       if(property_name != 'prototype'){
//         Object.defineProperty(ExtClass, property_name, descriptor);
//       }
//     }
//     return ExtClass;
//   };
// }
//# sourceMappingURL=bll.js.map