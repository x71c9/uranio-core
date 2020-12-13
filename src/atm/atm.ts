/**
 *
 * Module for general Atom class
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import {AtomName, Grain, PropertiesOfAtom} from '../types';

import {atom_book} from '../urn.config';

const urn_exc = urn_exception.init('ATM','Atom Class Module');

/**
 * Class for general Atom
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class Atom<A extends AtomName> {
	
	public _id?:string;
	
	public _deleted_from?:string;
	
	public date?:Date;
	
	constructor(public name:A, resource:Grain<A>){
		
		this.validate(resource);
		
		if(urn_util.object.has_key(resource, '_id')){
			this._id = resource._id;
		}
		
		if(urn_util.object.has_key(resource, '_deleted_from')){
			this._deleted_from = resource._deleted_from;
		}
		
		if(urn_util.object.has_key(resource, 'date')){
			this.date = resource.date;
		}
		
	}
	
	public return()
			:Grain<A>{
		
		const that = this as any;
		this.validate(that);
		
		const data_transfer_object = {} as Grain<A>;
		const props:PropertiesOfAtom<A> = atom_book[this.name].properties;
		let k: keyof typeof props;
		for(k in props){
		// for(const [k] of Object.entries(props)){
			if(!urn_util.object.has_key(that, k)){
				const err_msg = `Cannot return. Current instance has no property [${k}] set.`;
				throw urn_exc.create('RETURN_NO_PROP', err_msg);
			}
			data_transfer_object[k] = that[k];
		}
		if(urn_util.object.has_key(that, '_id')){
			data_transfer_object._id = that._id;
		}
		if(urn_util.object.has_key(that, '_deleted_from')){
			data_transfer_object._deleted_from = that._deleted_from;
		}
		if(urn_util.object.has_key(that, 'date')){
			data_transfer_object.date = that.date;
		}
		return data_transfer_object;
	}
	
	public validate(resource:Grain<A>)
			:true {
		console.log(resource);
		return true;
	}
}

// export type AtomInstance = InstanceType<typeof Atom>;

export function create<A extends AtomName>(atom_name:A, resource:Grain<A>)
		:Atom<A>{
	urn_log.fn_debug(`Create Atom [${atom_name}]`);
	return new Atom<A>(atom_name, resource);
}


// export function create_atom<M extends models.Resource, A extends Atom<M>>
// (model_instance:M, atom_class: new (init: M) => A)
//     :A{
//   urn_log.fn_debug(`Create ${atom_class.constructor.name}`);
//   return new atom_class(model_instance);
// }


