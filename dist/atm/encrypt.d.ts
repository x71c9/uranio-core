/**
 * Module for schema.Atom Encryption
 *
 * @packageDocumentation
 */
import { schema } from '../sch/index';
export declare function property<A extends schema.AtomName, D extends schema.Depth = 0>(atom_name: A, prop_key: keyof schema.Molecule<A, D>, prop_value: string): Promise<string>;
export declare function properties<A extends schema.AtomName>(atom_name: A, atom: schema.AtomShape<A>): Promise<schema.AtomShape<A>>;
export declare function properties<A extends schema.AtomName>(atom_name: A, atom: Partial<schema.AtomShape<A>>): Promise<Partial<schema.AtomShape<A>>>;
