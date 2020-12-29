/**
 * Types for Relation module
 *
 * @packageDocumentation
 */

import {Depth, Query, AtomName, Atom, AtomShape, Element} from '../types';

export interface Relation<A extends AtomName> {
	
	select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>):Promise<Element<A,D>[]>;
	
	select_by_id(id:string):Promise<Atom<A>>;
	
	select_one(query:Query<A>, options?:Query.Options<A>):Promise<Atom<A>>;
	
	insert_one(atom_shape:AtomShape<A>):Promise<Atom<A>>;
	
	alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>):Promise<Atom<A>>;
	
	replace_by_id(id:string, atom:AtomShape<A>):Promise<Atom<A>>;
	
	delete_by_id(id:string):Promise<Atom<A>>;
	
	is_valid_id(id:string):boolean;
	
}
