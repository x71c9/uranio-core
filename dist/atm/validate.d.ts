/**
 * Module for Atom Validation
 *
 * @packageDocumentation
 */
import { AtomName, Atom, AtomShape, Book, Depth, Molecule } from '../types';
export declare function is_valid_property<A extends AtomName>(atom_name: A, key: keyof Atom<A>): boolean;
export declare function is_optional_property<A extends AtomName>(atom_name: A, key: keyof Atom<A>): boolean;
export declare function validate<A extends AtomName>(atom_name: A, molecule: Atom<A>): Atom<A>;
export declare function validate<A extends AtomName, D extends Depth>(atom_name: A, molecule: Molecule<A, D>, depth?: D): Molecule<A, D>;
export declare function validate_molecule_primitive_properties<A extends AtomName, D extends Depth>(atom_name: A, molecule: Molecule<A, D>): true;
export declare function validate_atom<A extends AtomName>(atom_name: A, atom: Atom<A>): Atom<A>;
export declare function validate_atom_shape<A extends AtomName>(atom_name: A, atom_shape: AtomShape<A>): true;
export declare function validate_atom_partial<A extends AtomName>(atom_name: A, partial_atom: Partial<AtomShape<A>>): true;
export declare function validate_property<A extends AtomName>(prop_key: keyof Atom<A>, prop_def: Book.Definition.Property, prop_value: unknown, atom: Atom<A>): true;
export declare function _validate_encrypt_property<A extends AtomName>(prop_key: keyof Atom<A>, prop_def: Book.Definition.Property.Encrypted, prop_value: string): true;
