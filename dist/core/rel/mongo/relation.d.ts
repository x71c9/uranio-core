/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { Query, AtomName, Atom, AtomShape, Depth, Molecule } from '../../types';
import { Relation } from '../types';
import { ConnectionName } from './types';
/**
 * Mongoose Relation class
 */
export declare class MongooseRelation<A extends AtomName> implements Relation<A> {
    atom_name: A;
    protected _conn_name: ConnectionName;
    protected _raw: mongoose.Model<mongoose.Document>;
    constructor(atom_name: A);
    protected _get_conn_name(): ConnectionName;
    select<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    select_by_id<D extends Depth>(id: string, depth?: D): Promise<Molecule<A, D>>;
    select_one<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    insert_one(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    replace_by_id(id: string, atom: AtomShape<A>): Promise<Atom<A>>;
    delete_by_id(id: string): Promise<Atom<A>>;
    is_valid_id(id: string): boolean;
}
export declare function create<A extends AtomName>(atom_name: A): MongooseRelation<A>;
