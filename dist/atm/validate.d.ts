/**
 * Module for schema.Atom Validation
 *
 * @packageDocumentation
 */
import { schema } from '../sch/index';
import { Book } from '../cln/types';
export declare function molecule<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecule: schema.Molecule<A, D>, depth?: D): schema.Molecule<A, D>;
export declare function any<A extends schema.AtomName>(atom_name: A, molecule: schema.Atom<A>): schema.Atom<A>;
export declare function any<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecule: schema.Molecule<A, D>, depth?: D): schema.Molecule<A, D>;
export declare function molecule_primitive_properties<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, molecule: schema.Molecule<A, D>): true;
export declare function atom<A extends schema.AtomName>(atom_name: A, atom: schema.Atom<A>): schema.Atom<A>;
export declare function atom_shape<A extends schema.AtomName>(atom_name: A, atom_shape: schema.AtomShape<A>): true;
export declare function atom_partial<A extends schema.AuthName>(atom_name: A, partial_atom: Partial<schema.AtomShape<A>>): true;
export declare function atom_partial<A extends schema.AtomName>(atom_name: A, partial_atom: Partial<schema.AtomShape<A>>): true;
export declare function property<A extends schema.AtomName, D extends schema.Depth = 0>(prop_key: keyof schema.Molecule<A, D>, prop_def: Book.Definition.Property, prop_value: unknown, atom: schema.Atom<A>): true;
export declare function encrypt_property<A extends schema.AtomName, D extends schema.Depth = 0>(prop_key: keyof schema.Molecule<A, D>, prop_def: Book.Definition.Property.Encrypted, prop_value: string): true;
