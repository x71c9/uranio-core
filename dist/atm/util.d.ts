/**
 * Module for schema.Atom Util
 *
 * @packageDocumentation
 */
import { schema } from '../sch/';
export declare function molecule_to_atom<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecule: schema.Molecule<A, D>): schema.Atom<A>;
export declare function get_subatom_name<A extends schema.AtomName>(atom_name: A, atom_key: string): schema.AtomName;
export declare function is_atom<A extends schema.AtomName>(atom_name: A, atom: schema.Atom<A>): atom is schema.Atom<A>;
export declare function is_molecule<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecule: schema.Molecule<A, D>): molecule is schema.Molecule<A, D>;
export declare function is_auth_atom_name<A extends schema.AtomName>(atom_name: A): boolean;
export declare function is_auth_atom<A extends schema.AuthName>(atom: unknown): atom is schema.AuthAtom<A>;
export declare function hide_hidden_properties<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecules: schema.Molecule<A, D>): schema.Molecule<A, D>;
export declare function hide_hidden_properties<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecules: schema.Molecule<A, D>[]): schema.Molecule<A, D>[];
export declare function is_optional_property<A extends schema.AtomName>(atom_name: A, key: keyof schema.Atom<A>): boolean;
export declare function has_property<A extends schema.AtomName>(atom_name: A, key: string): boolean;
export declare function has_property<A extends schema.AtomName>(atom_name: A, key: keyof schema.Atom<A>): boolean;
export declare function delete_undefined_optional<A extends schema.AtomName>(atom_name: A, partial_atom: Partial<schema.AtomShape<A>>): Partial<schema.AtomShape<A>>;
