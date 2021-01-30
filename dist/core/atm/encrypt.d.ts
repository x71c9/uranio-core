/**
 * Module for Atom Encryption
 *
 * @packageDocumentation
 */
import { AtomName, Atom, AtomShape } from '../types';
export declare function encrypt_property<A extends AtomName>(atom_name: A, prop_key: keyof Atom<A>, prop_value: string): Promise<string>;
export declare function encrypt_properties<A extends AtomName>(atom_name: A, atom: AtomShape<A>): Promise<AtomShape<A>>;
