/**
 * Module for general Resource class
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {urn_log} from 'urn-lib';

/**
 * Class for general Resource
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class Resource implements urn_mdls.resources.Resource {
	
	public _id:string;
	
	constructor(resource:urn_mdls.resources.Resource){
		
		this._id = resource._id;
		
	}
	
}

export type ResourceInstance = InstanceType<typeof Resource>;

export default function create_instance(resource:urn_mdls.resources.Resource)
		:ResourceInstance{
	return new Resource(resource);
}
