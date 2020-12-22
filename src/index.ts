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

const obi_bll = urn_core.bll.create('obi');

const obi_one = {
	other_id: '92348njkhds8fsdnusoda',
	label: 'OBIONW8',
	mail: 'ddd@d.com',
	age: 18,
	price: 888.0099,
	active: true,
	password: 'dskjfhdkhfUks9',
	confirmation_date: new Date('2020-12-01'),
	categories: ['w','2'],
	type: [1,1,1],
	string: 'OSJKSJLSK',
	media: {}
};
obi_bll.save_one(obi_one).then(function(data){
	console.log(data);
});

// obi_bll.find_by_id('5fe1c63dc54db8444cfdabc0').then(function(data){
//   console.log(data);
//   data.password = 'VAFFANCU8L';
//   obi_bll.update_and_encrypt_one(data).then(function(data){
//     console.log(data);
//   });
// });

