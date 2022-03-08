/**
 * Web run module
 *
 * @packageDocumentation
 */
// import {urn_log} from 'urn-lib';
// urn_log.init(urn_log.LogLevel.FUNCTION_DEBUG);

import uranio from './server';
uranio.init();

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
