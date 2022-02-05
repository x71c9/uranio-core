/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/';
import { SecurityBLL } from './security';
export declare class AuthBLL<A extends schema.AtomName> extends SecurityBLL<A> {
    insert_new(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
}
