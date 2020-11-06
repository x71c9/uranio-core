/**
 *
 * Module for general Resource class
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {urn_log, urn_error} from 'urn-lib';

/**
 * Class for general Resource
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class Resource implements urn_mdls.resources.Resource {
	
	public _id?:string;
	
	constructor(resource:urn_mdls.resources.Resource){
		
		this.validate(resource);
		
		this._id = resource._id;
		
	}
	
	public validate(resource:urn_mdls.resources.Resource):true | never{
		if(typeof resource !== 'object' || resource === null){
			throw urn_error.create(`Invalid initializer object type in Resource class - type [${typeof resource}]`);
		}
		if(typeof resource._id !== typeof undefined && typeof resource._id !== 'string'){
			console.log(resource);
			console.log(resource._id);
			throw urn_error.create(`Invalid initializer object key type for _id - type [${typeof resource._id}]`);
		}
		return true;
	}
}

export type ResourceInstance = InstanceType<typeof Resource>;

export type CreateResourceFunction<M extends urn_mdls.resources.Resource, R extends ResourceInstance> =
	(resource:M) => R;

export const create:CreateResourceFunction<urn_mdls.resources.Resource, ResourceInstance> =
	(resource) => {
		urn_log.fn_debug(`Create Resource`);
		return new Resource(resource);
	};

