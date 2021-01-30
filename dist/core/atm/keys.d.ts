/**
 * Module for Atom Keys
 *
 * @packageDocumentation
 */
import { AtomName, Atom, AtomShape, Molecule } from '../types';
export declare function get_encrypted_keys<A extends AtomName>(atom_name: A): Set<keyof Atom<A>>;
export declare function get_unique_keys<A extends AtomName>(atom_name: A): Set<keyof AtomShape<A>>;
export declare function get_bond_keys<A extends AtomName>(atom_name: A): Set<keyof Molecule<A>>;
export declare function get_subatom_array_keys<A extends AtomName>(atom_name: A): Set<keyof AtomShape<A>>;
export declare function get_subatom_non_array_keys<A extends AtomName>(atom_name: A): Set<keyof AtomShape<A>>;
