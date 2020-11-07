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
	
	public return():M{
		const data_transfer_object = {} as M;
		for(const key of this.keys.approved){
			data_transfer_object[key] = this[key];
		}
		return data_transfer_object;
	}
	
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

// https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgEoQM4HsCuUkCyWAJhADbIDeAsAFDIPID6wxAXMhmFKAOZ0BfOnVCRYiFAFUM0IqQoQAHpBDEMaTLnwQ55KnUbIYwKFyYg4AWwhsuPEP1pDadMAE8ADigDKWawGkINwwAeRgAHgAVAD5kAF5kbwgwcIBrIKwYZBiAbmFaBCwQLmQcGSgmdOC2XwCg0IjpWRJyWISQCAB3ROSACgBtAHJjUzBzKwhBgBpBlmJBgF0ASjyXWjgAIztEMGQEMjgMdQBBMD9wgmQlFTUNbDxCFrJY4EsPMghrcHV0e+1dCg0eiMDw4DZkYAIZisWzcPirQyFYrcHAIM5QXpQTQPGy-LSPeRLIGGQxgAAWwAwADo5vFkFi-kgaawEYxnIZQeDIchNts0fTkngQL0lmwCKtnHR9od1E0oFdlBBVCczpZwnKAS83h8vmBZeUAfpgQxORCoSMzBZrLD7I5EUU7Kj0b0ytA2BqnlNkB4eAA3OCQZhwDw+rC+iDESr1Gp+CCBYJhdUGp7RIkGEkMDA4LwY11QFbpjPkylUi1jK0oBJ50smS0TVkMdkgsFmgVgIUi4kZvYO3bEM50ygCHn65ryBskmBYDFIkqpZCZZDF6lMYOh8ORqoYNPG7sMftYfqpBZ05dHhY5ZCFklNklY9tQEDIA8T5yS2gAeg-S88KHQD5AAARSIQnCY4FRuFU-C9S5riVW48RxTU6V6AM-DYY4lniWICHyL8jBwEA0WAIo2yFJgDzYf8hWAkIgA

// export type AtomInstance = InstanceType<typeof Atom>;

// export const create:AtomCreateFunction<urn_mdls.resources.Resource, AtomInstance> =
//   (resource) => {
//     urn_log.fn_debug(`Create Atom`);
//     return new Atom(resource);
//   };



