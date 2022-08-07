/**
 * Core dev module
 *
 * @packageDocumentation
 */

import uranio from './server';
uranio.init();

const bll = uranio.bll.basic.create('superuser');
bll.find({})
	.then((data) => {
		console.log(data);
	})
	.catch((data) => {
		console.error(data);
	});
