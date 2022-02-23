/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { schema } from '../../sch/server';
import { ConnectionName } from '../../typ/book_cln';
import { Relation } from '../types';
/**
 * Mongoose Relation class
 */
export declare class MongooseRelation<A extends schema.AtomName> implements Relation<A> {
    atom_name: A;
    protected _conn_name: ConnectionName;
    protected _raw: mongoose.Model<mongoose.Document>;
    constructor(atom_name: A);
    protected _get_conn_name(): ConnectionName;
    select<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    select_by_id<D extends schema.Depth>(id: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    select_one<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    count(query: schema.Query<A>): Promise<number>;
    insert_one(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>>;
    replace_by_id(id: string, atom: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    delete_by_id(id: string): Promise<schema.Atom<A>>;
    alter_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    delete_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
    is_valid_id(id: string): boolean;
}
export declare function create<A extends schema.AtomName>(atom_name: A): MongooseRelation<A>;
