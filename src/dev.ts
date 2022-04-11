/**
 * Core dev module
 *
 * @packageDocumentation
 */

import uranio from './server';
uranio.init();

const bll = uranio.bll.basic.create('superuser');
bll.search('uranio').then((a) => {
	console.log(a);
});
