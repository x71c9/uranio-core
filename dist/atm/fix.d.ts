/**
 * Module for schema.Atom Util
 *
 * @packageDocumentation
 */
import { schema } from '../sch/client';
export declare function property<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, atom: schema.Molecule<A, D>, key: keyof schema.Molecule<A, D>): schema.Molecule<A, D>;
