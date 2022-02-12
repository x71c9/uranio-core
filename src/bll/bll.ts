/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

import {AuthBLL} from './auth';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class BLL<A extends schema.AtomName> extends AuthBLL<A>{}


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

