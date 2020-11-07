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
export abstract class Atom<M extends urn_mdls.resources.Resource> implements urn_mdls.resources.Resource {
	
	public _id?:string;
	
	public keys:urn_mdls.ModelKeysCategories<M>;
	
	constructor(resource:M){
		
		this.keys = this._get_keys();
		
		this.validate(resource);
		
		this._id = resource._id;
		
	}
	
	protected abstract _get_keys():urn_mdls.ModelKeysCategories<M>;
	
	public validate(resource:M):true | never{
		console.log(resource);
		if(typeof resource !== 'object' || resource === null){
			throw urn_error.create(`Invalid initializer object type in Atom class - type [${typeof resource}]`);
		}
		if(typeof resource._id !== typeof undefined && typeof resource._id !== 'string'){
			throw urn_error.create(`Invalid initializer object key type for _id - type [${typeof resource._id}]`);
		}
		return true;
	}
}

// export type AtomInstance = InstanceType<typeof Atom>;

// export const create:AtomCreateFunction<urn_mdls.resources.Resource, AtomInstance> =
//   (resource) => {
//     urn_log.fn_debug(`Create Atom`);
//     return new Atom(resource);
//   };



