/**
 * Module for schema.Atom Keys
 *
 * @packageDocumentation
 */
import { schema } from '../sch/client';
export declare function get_optional<A extends schema.AtomName>(atom_name: A): Set<keyof schema.Atom<A>>;
export declare function get_search_indexes<A extends schema.AtomName>(atom_name: A): Set<keyof schema.Atom<A>>;
export declare function get_hidden<A extends schema.AtomName, D extends schema.Depth = 0>(atom_name: A): Set<keyof schema.Molecule<A, D>>;
export declare function get_encrypted<A extends schema.AtomName>(atom_name: A): Set<keyof schema.Atom<A>>;
export declare function get_unique<A extends schema.AtomName>(atom_name: A): Set<keyof schema.AtomShape<A>>;
export declare function get_bond<A extends schema.AtomName, D extends schema.Depth = 0>(atom_name: A): Set<keyof schema.Molecule<A, D>>;
export declare function get_bond_array<A extends schema.AtomName>(atom_name: A): Set<keyof schema.AtomShape<A>>;
export declare function get_bond_non_array<A extends schema.AtomName>(atom_name: A): Set<keyof schema.AtomShape<A>>;
