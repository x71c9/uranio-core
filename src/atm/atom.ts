/**
 *
 * Module for general Atom class
 *
 * @packageDocumentation
 */

import {urn_log, urn_error, urn_util} from 'urn-lib';

import {models} from './types';

/**
 * Class for general Atom
 */
@urn_log.decorators.debug_methods
export abstract class Atom<Model extends models.Resource> implements models.Resource {
	
	public _id?:string;
	
	public _deleted_from?:string;
	
	public date?:Date;
	
	constructor(resource:Model){
		
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
	
	protected abstract _get_keys():models.ModelKeysCategories<Model>;
	
	public return()
			:Model{
		
		const that = this as any;
		this.validate(that);
		
		const data_transfer_object = {} as Model;
		for(const key of this._get_keys().approved){
			if(!this._get_keys().optional.has(key) && !urn_util.object.has_key(that, key)){
				throw urn_error.create(`Cannot return(). Current instance has no property [${key}] set.`);
			}
			data_transfer_object[key] = that[key];
		}
		return data_transfer_object;
	}
	
	public validate(resource:Model)
			:true | never{
		if(typeof resource !== 'object' || resource === null){
			const resource_type = (typeof resource === 'object') ? 'null' : typeof resource;
			let err_msg = `Invalid ${this.constructor.name} constructor initializer type.`;
			err_msg += ` Constructor initializer value must be of type "object" - given type [${resource_type}].`;
			throw urn_error.create(err_msg);
		}
		for(const key of this._get_keys().approved){
			if(this._get_keys().optional.has(key))
				continue;
			if(!urn_util.object.has_key(resource, key)){
				let err_msg = `Invalid ${this.constructor.name} constructor initializer.`;
				err_msg += ` Initializer is missing propery [${key}].`;
				throw urn_error.create(err_msg);
			}
		}
		const types:Set<keyof models.ModelKeysCategories<Model>> =
			new Set(['boolean', 'number', 'string', 'object']);
		for(const t of types){
			for(const key of this._get_keys()[t]){
				if(this._get_keys().optional.has(key) && typeof resource[key] === typeof undefined)
					continue;
				if(typeof resource[key] !== t){
					let err_msg = `Invalid initializer key type [${key}].`;
					err_msg += ` Type must be "${t}" - given type [${typeof resource[key]}]`;
					throw urn_error.create(err_msg);
				}
			}
		}
		
		for(const key of this._get_keys().date){
			if(this._get_keys().optional.has(key) && typeof resource[key] === typeof undefined)
				continue;
			if(!urn_util.is_date(resource[key])){
				let err_msg = `Invalid initializer key type [${key}].`;
				err_msg += ` Type must be "date" - given type [${typeof resource[key]}]`;
				throw urn_error.create(err_msg);
			}
		}
		
		return true;
	}
}

export function create_atom<M extends models.Resource, A extends Atom<M>>
(model_instance:M, atom_class: new (init: M) => A)
		:A{
	urn_log.fn_debug(`Create ${atom_class.constructor.name}`);
	try{
		return new atom_class(model_instance);
	}catch(err){
		throw urn_error.create(`Cannot create Atom [${atom_class.constructor.name}]. ` + err.message, err);
	}
}


