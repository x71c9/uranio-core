/**
 * Types for Relation module
 *
 * @packageDocumentation
 */

import {
	Query,
	AtomName,
	Atom,
	AtomShape,
	Depth,
	Molecule
} from '../types';

export interface Relation<A extends AtomName> {
	
	select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>):Promise<Molecule<A,D>[]>;
	
	select_by_id<D extends Depth>(id:string, depth?:D):Promise<Molecule<A,D>>;
	
	select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>):Promise<Molecule<A,D>>;
	
	insert_one(atom_shape:AtomShape<A>):Promise<Atom<A>>;
	
	alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>):Promise<Atom<A>>;
	
	replace_by_id(id:string, atom:AtomShape<A>):Promise<Atom<A>>;
	
	delete_by_id(id:string):Promise<Atom<A>>;
	
	is_valid_id(id:string):boolean;
	
}
