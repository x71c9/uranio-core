/**
 * Class for Encrypt Data Access Layer
 *
 * This class handle schema.Atom's encrypted properties.
 * It will encrypt before `insert_one`
 * It will also check if a property with ENCRYPT type has changed and encrypt
 * it again before `alter_by_id`.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/index';
import { ValidateDAL } from './validate';
export declare class EncryptDAL<A extends schema.AtomName> extends ValidateDAL<A> {
    private abstract_dal;
    constructor(atom_name: A);
    insert_one(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    alter_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    protected _encrypt_changed_properties(id: string, atom: schema.Atom<A>): Promise<schema.Atom<A>>;
    protected _encrypt_changed_properties(id: string, atom: Partial<schema.AtomShape<A>>): Promise<Partial<schema.AtomShape<A>>>;
}
export declare function create_encrypt<A extends schema.AtomName>(atom_name: A): EncryptDAL<A>;
