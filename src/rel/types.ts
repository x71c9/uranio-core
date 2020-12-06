/**
 * Types for Relation module
 *
 * @packageDocumentation
 */
import * as urn_atm from '../atm/';

import {QueryOptions, FilterType} from '../types';

export interface Relation<M extends urn_atm.models.Resource> {
	
	select(filter:FilterType<M>, options?:QueryOptions<M>):Promise<urn_atm.models.Resource[]>;
	
	select_by_id(id:string):Promise<urn_atm.models.Resource>;
	
	select_one(filter:FilterType<M>, options?:QueryOptions<M>):Promise<urn_atm.models.Resource>;
	
	insert_one(resource:urn_atm.models.Resource):Promise<urn_atm.models.Resource>;
	
	alter_one(resource:urn_atm.models.Resource):Promise<urn_atm.models.Resource>;
	
	delete_one(resource:urn_atm.models.Resource):Promise<urn_atm.models.Resource>;
	
	is_valid_id(id:string):boolean;
	
}
