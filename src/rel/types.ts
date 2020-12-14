/**
 * Types for Relation module
 *
 * @packageDocumentation
 */

import {QueryOptions, FilterType, AtomName, Atom, AtomShape} from '../types';

export interface Relation<A extends AtomName> {
	
	select(filter:FilterType<A>, options?:QueryOptions<A>):Promise<Atom<A>[]>;
	
	select_by_id(id:string):Promise<Atom<A>>;
	
	select_one(filter:FilterType<A>, options?:QueryOptions<A>):Promise<Atom<A>>;
	
	insert_one(atom_shape:AtomShape<A>):Promise<Atom<A>>;
	
	alter_one(atom:Atom<A>):Promise<Atom<A>>;
	
	alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>):Promise<Atom<A>>;
	
	delete_one(atom:Atom<A>):Promise<Atom<A>>;
	
	delete_by_id(id:string):Promise<Atom<A>>;
	
	is_valid_id(id:string):boolean;
	
}
