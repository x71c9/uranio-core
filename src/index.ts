/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

import * as urn_core from './main';

export default urn_core;

const superuser_bll = urn_core.bll.create('superuser');

superuser_bll.find({}).then(function(data){
	console.log(data);
});

// superuser_bll.save_one({email: 'adjdd@a.com', password: 'sadkjsklad'}).then(function(data){
//   console.log(data);
// });

// const pro_bll = urn_core.bll.create('product');

// pro_bll.find({}).then(function(data){
//   console.log(data);
// });

// pro_bll.save_one({title: 'Product title', barcode: '98923084023'}).then(function(data){
//   console.log(data);
// });

const obi_bll = urn_core.bll.create('obi');

const obi_one = {
	other_id: '92348njkhds8fsdnusoda',
	label: 'OBIONW8',
	mail: 'dddd',
	age: -1,
	price: 888.0099,
	active: 3,
	password: 6,
	confirmation_date: '2020-12-0',
	categories: ['w','2'],
	media: {}
};

obi_bll.save_one(obi_one).then(function(data){
	console.log(data);
});

