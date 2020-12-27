/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

import * as urn_core from './main';

export default urn_core;

// const superuser_bll = urn_core.bll.create('superuser');

// superuser_bll.find({}).then(function(data){
//   console.log(data);
// });

// superuser_bll.save_one({email: 'adjdd@a.com', password: 'sadkjsklad'}).then(function(data){
//   console.log(data);
// });

// const pro_bll = urn_core.bll.create('product');

// pro_bll.find({}).then(function(data){
//   console.log(data);
// });

// pro_bll.save_one({title: 'Product title', barcode: '98923084023', active: false}).then(function(data){
//   console.log(data);
// });

// import bcrypt from 'bcrypt';

const obi_bll = urn_core.bll.create('obi');
obi_bll.find_one({_id: '5fe851637b02c733da9d1e8a'}).then((data) => {
	console.log('FIND');
	console.log(data);
	// data.active = false;
	// data.age = 55;
	// // data.password = 'STOxAZZO6';
	// obi_bll.update_one(data).then((resp) => {
	//   console.log(resp);
	//   bcrypt.compare('STOxAZZO6', resp.password).then((is_eq) => console.log(is_eq));
	// });
}).catch((err) => {
	console.log(err);
});

// const obi_one = {
//   other_id: '92348njkhds8fsdnusoda',
//   label: 'a8',
//   mail: 'ddd@d.com',
//   age: 18,
//   price: 1800.99,
//   active: true,
//   password: 'dskjfhdkhfUks9',
//   confirmation_date: new Date('2020-12-01'),
//   categories: ['CatA', 'CatB'],
//   type: 1,
//   string: 'OSJKSJLSK',
//   media: {}
// };
// obi_bll.add_one(obi_one).then(function(data){
//   console.log(data);
// });

// obi_bll.find_by_id('5fe1c63dc54db8444cfdabc0').then(function(data){
//   console.log(data);
//   data.password = 'VAFFANCU8L';
//   obi_bll.update_and_encrypt_one(data).then(function(data){
//     console.log(data);
//   });
// });

