/**
 * Types for Relation module
 *
 * @packageDocumentation
 */
import * as urn_atm from '../atm/';

import {QueryOptions, FilterType} from '../types';

export interface Relation<M extends urn_atm.models.Resource> {
	
	find(filter:FilterType<M>, options?:QueryOptions<M>):Promise<M[]>;
	
	find_by_id(id:string):Promise<M>;
	
	find_one(filter:FilterType<M>, options?:QueryOptions<M>):Promise<M>;
	
	insert_one(resource:M):Promise<M>;
	
	alter_one(resource:M):Promise<M>;
	
	delete_one(resource:M):Promise<M>;
	
	is_valid_id(id:string):boolean;
	
}
