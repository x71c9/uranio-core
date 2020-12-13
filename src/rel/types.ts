/**
 * Types for Relation module
 *
 * @packageDocumentation
 */

import {QueryOptions, FilterType, AtomName, Grain} from '../types';

export interface Relation<A extends AtomName> {
	
	select(filter:FilterType<A>, options?:QueryOptions<A>):Promise<Grain<A>[]>;
	
	select_by_id(id:string):Promise<Grain<A>>;
	
	select_one(filter:FilterType<A>, options?:QueryOptions<A>):Promise<Grain<A>>;
	
	insert_one(grain:Grain<A>):Promise<Grain<A>>;
	
	alter_one(grain:Grain<A>):Promise<Grain<A>>;
	
	delete_one(grain:Grain<A>):Promise<Grain<A>>;
	
	is_valid_id(id:string):boolean;
	
}
