/**
 * Core dev module
 *
 * @packageDocumentation
 */

import uranio from './server';
uranio.init();

// const bll = uranio.bll.basic.create('superuser');
// bll.search('andr').then((a) => {
// 	console.log(a);
// });

const bll = uranio.bll.basic.create('user');
bll.find_by_id('61e9980a5bea5d4f9044f19b', {depth: 1}).then((a) => {
	console.log(a);
});
