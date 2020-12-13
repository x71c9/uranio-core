/**
 *
 * Module for Atom class
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import {AtomName, Grain, PropertiesOfAtom, KeysOfAtom} from '../types';

import {atom_book} from '../book';

const urn_exc = urn_exception.init('ATM','Atom Class Module');

/**
 * Class for general Atom
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class Atom<A extends AtomName> {
	
	[k:string]:any;
	
	public _id?:string;
	
	public _deleted_from?:string;
	
	public date?:Date;
	
	constructor(public _name:A, grain:Grain<A>){
		
		this.validate(grain);
		
		if(urn_util.object.has_key(grain, '_id')){
			this._id = grain._id;
		}
		if(urn_util.object.has_key(grain, '_deleted_from')){
			this._deleted_from = grain._deleted_from;
		}
		if(urn_util.object.has_key(grain, 'date')){
			this.date = grain.date;
		}
		
		for(const [k,v] of Object.entries(grain)){
			this[k] = v;
		}
		
	}
	
	public return()
			:Grain<A>{
		
		const that = this as any;
		this.validate(that);
		
		const data_transfer_object = {} as Grain<A>;
		if(urn_util.object.has_key(this, '_id')){
			data_transfer_object._id = this._id;
		}
		if(urn_util.object.has_key(this, '_deleted_from')){
			data_transfer_object._deleted_from = this._deleted_from;
		}
		if(urn_util.object.has_key(this, 'date')){
			data_transfer_object.date = this.date;
		}
		const props:PropertiesOfAtom<A> = atom_book[this._name].properties;
		let k: KeysOfAtom<A>;
		for(k in props){
		// for(const [k] of Object.entries(props)){
			if(!urn_util.object.has_key(this, k)){
				const err_msg = `Cannot return. Current instance has no property [${k}] set.`;
				throw urn_exc.create('RETURN_NO_PROP', err_msg);
			}
			data_transfer_object[k] = that[k];
		}
		return data_transfer_object;
	}
	
	public validate(grain:Grain<A>)
			:true {
		console.log(grain);
		return true;
	}
}

// export type AtomInstance = InstanceType<typeof Atom>;

export function create<A extends AtomName>(atom_name:A, grain:Grain<A>)
		:Atom<A>{
	urn_log.fn_debug(`Create Atom [${atom_name}]`);
	return new Atom<A>(atom_name, grain);
}


// export function create_atom<M extends models.Resource, A extends Atom<M>>
// (model_instance:M, atom_class: new (init: M) => A)
//     :A{
//   urn_log.fn_debug(`Create ${atom_class.constructor.name}`);
//   return new atom_class(model_instance);
// }


