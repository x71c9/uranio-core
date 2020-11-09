/**
 *
 * Module for general Atom class
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {urn_log, urn_error} from 'urn-lib';

/**
 * Class for general Atom
 */
@urn_log.decorators.debug_methods
export abstract class Atom<Model extends urn_mdls.resources.Resource> implements urn_mdls.resources.Resource {
	
	public _id?:string;
	
	constructor(resource:Model){
		
		this.validate(resource);
		
		this._id = resource._id;
		
	}
	
	protected abstract _get_keys():urn_mdls.ModelKeysCategories<Model>;
	
	public return()
			:Model{
		
		const that = this as any;
		this.validate(that);
		
		const data_transfer_object = {} as Model;
		for(const key of this._get_keys().approved){
			if(!Object.prototype.hasOwnProperty.call(that, key)){
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
			if(key === '_id')
				continue;
			if(!Object.prototype.hasOwnProperty.call(resource, key)){
				let err_msg = `Invalid ${this.constructor.name} constructor initializer.`;
				err_msg += `Initializer is missing propery [${key}].`;
				throw urn_error.create(err_msg);
			}
		}
		const types:Set<keyof urn_mdls.ModelKeysCategories<Model>> =
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
			if(Object.prototype.toString.call(resource[key]) !== '[object Date]'){
				let err_msg = `Invalid initializer key type [${key}].`;
				err_msg += ` Type must be "date" - given type [${typeof resource[key]}]`;
				throw urn_error.create(err_msg);
			}
		}

		return true;
	}
}

