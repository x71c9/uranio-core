/**
 * Types for Relation module
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {QueryFilter, QueryOptions} from '../types';

export interface Relation<M extends urn_mdls.resources.Resource> {
	
	find(filter:QueryFilter<M>, options?:QueryOptions<M>):Promise<M[]>;
	
	find_by_id(id:string):Promise<M | null>;
	
	find_one(filter:QueryFilter<M>, options?:QueryOptions<M>):Promise<M | null>;
	
	insert_one(resource:M):Promise<M | null>;
	
	update_one(resource:M):Promise<M | null>;
	
	delete_one(resource:M):Promise<M | null>;
	
	is_valid_is(id:string):boolean;
	
}
