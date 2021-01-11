/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */
import { Atom, AtomName, Molecule, Depth } from '../types';
export declare function molecule_to_atom<A extends AtomName, D extends Depth>(atom_name: A, molecule: Molecule<A, D>): Atom<A>;
export declare function get_subatom_name<A extends AtomName>(atom_name: A, atom_key: string): AtomName;
export declare function is_atom<A extends AtomName>(atom_name: A, atom: Atom<A>): atom is Atom<A>;
export declare function is_molecule<A extends AtomName, D extends Depth>(atom_name: A, molecule: Molecule<A, D>): molecule is Molecule<A, D>;
export declare function fix_property<A extends AtomName>(atom_name: A, atom: Atom<A>, key: keyof Atom<A>): Atom<A>;
export declare function fix_property<A extends AtomName, D extends Depth>(atom_name: A, atom: Molecule<A, D>, key: keyof Molecule<A, D>): Molecule<A, D>;
