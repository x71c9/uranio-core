/**
 * Class for Encrypt Data Access Layer
 *
 * @packageDocumentation
 */
import { AtomName, AtomShape, Atom } from '../types';
import { ValidateDAL } from './validate';
export declare class EncryptDAL<A extends AtomName> extends ValidateDAL<A> {
    insert_one(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    protected _encrypt_changed_properties(id: string, atom: Atom<A>): Promise<Atom<A>>;
    protected _encrypt_changed_properties(id: string, atom: Partial<AtomShape<A>>): Promise<Partial<AtomShape<A>>>;
}
export declare function create_encrypt<A extends AtomName>(atom_name: A): EncryptDAL<A>;
