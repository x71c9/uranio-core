/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { SecurityBLL } from './security';
export declare class AuthBLL<A extends schema.AtomName> extends SecurityBLL<A> {
    insert_new(atom_shape: schema.AtomShape<A>): Promise<schema.Molecule<A, 0>>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[], skip_on_error?: boolean): Promise<schema.Atom<A>[]>;
}
