/**
 * BLL interface
 *
 * @packageDocumentation
 */

// import {
//   AccessLayer,
//   Query,
//   AtomName,
//   Atom,
//   AtomShape,
//   Depth,
//   Molecule
// } from '../types';

// export interface IBLL<A extends AtomName> {
	
//   _al:AccessLayer<A>;
	
//   find<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>):Promise<Molecule<A,D>[]>;
	
//   find_by_id<D extends Depth>(id:string, options?:Query.Options<A,D>):Promise<Molecule<A,D>>;
	
//   find_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>):Promise<Molecule<A,D>>;
	
//   insert_new(atom_shape:AtomShape<A>):Promise<Atom<A>>;
	
//   update_by_id(id:string, partial_atom:Partial<AtomShape<A>>):Promise<Atom<A>>;
	
//   update_one(atom:Atom<A>):Promise<Atom<A>>;
	
//   remove_by_id(id:string):Promise<Atom<A>>;
	
//   remove_one<D extends Depth>(molecule:Molecule<A,D>):Promise<Atom<A>>;
	
// }
