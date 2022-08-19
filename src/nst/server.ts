/**
 * API Instances index module
 *
 * @packageDocumentation
 */

import * as bll from '../bll/server';

type ApiInstance<T> = T | undefined;

let core_bll_group:ApiInstance<bll.BLL<'_group'>>;

export function get_bll_group():bll.BLL<'_group'>{
	if(!core_bll_group){
		core_bll_group = bll.basic.create('_group');
	}
	return core_bll_group;
}
