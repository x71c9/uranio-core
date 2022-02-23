/**
 * API Instances index module
 *
 * @packageDocumentation
 */

import * as bll from '../bll/server';

type ApiInstance<T> = T | undefined;

let core_bll_group:ApiInstance<bll.BLL<'group'>>;

export function get_bll_group():bll.BLL<'group'>{
	if(!core_bll_group){
		core_bll_group = bll.basic.create('group');
	}
	return core_bll_group;
}
