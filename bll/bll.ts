/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_util} from 'urn-lib';

import {
	AtomName,
	TokenObject,
	Molecule,
	Depth,
	Query
} from '../typ/';

// import {CustomBLL} from './types';

// import {bll_book} from './book';

import {AuthBLL} from './auth';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class BLL<A extends AtomName> extends AuthBLL<A>{}

export type BLLInstance = InstanceType<typeof BLL>;

export function create<A extends AtomName>(atom_name:A, token_object?:TokenObject)
		:CustomBLL<A>{
	urn_log.fn_debug(`Create BLL [${atom_name}]`);
	
	if(urn_util.object.has_key(bll_book, atom_name)){
		return new bll_book[atom_name](token_object) as CustomBLL<A>;
	}else{
		return new BLL<A>(atom_name, token_object) as CustomBLL<A>;
	}
}

export type CustomBLL<A extends AtomName> =
	A extends keyof typeof bll_book ?
	InstanceType<typeof bll_book[A]> :
	BLL<A>;

export class my_class extends BLL<'product'> {
	constructor(token_object?:TokenObject){
		super('product', token_object);
	}
	public async find_by_id<D extends Depth>(id:string, options?:Query.Options<'product',D>)
			:Promise<Molecule<'product', D>>{
		console.log('CUSTOOOOM BLL');
		return await super.find_by_id(id, options) as Molecule<'product',D>;
	}
}

export function my_bll(token_object:TokenObject)
			:BLL<'product'>{
	return new my_class(token_object);
}


export const bll_book = {
	product: my_class
} as const;

