/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */
import * as urn_rel from '../rel/';
import { Depth, Query, AtomName, AtomShape, Atom, Molecule } from '../types';
export declare class DAL<A extends AtomName> {
    atom_name: A;
    protected _db_relation: urn_rel.Relation<A>;
    protected _db_trash_relation: urn_rel.Relation<A> | null;
    constructor(atom_name: A);
    protected validate(molecule: Atom<A>): Promise<Atom<A>>;
    protected validate(molecule: Atom<A>, depth?: 0): Promise<Atom<A>>;
    protected validate<D extends Depth>(molecule: Molecule<A, D>, depth?: D): Promise<Molecule<A, D>>;
    select<D extends Depth = 0>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    select_by_id<D extends Depth = 0>(id: string, depth?: D): Promise<Molecule<A, D>>;
    select_one<D extends Depth = 0>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    insert_one(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    alter_one(atom: Atom<A>): Promise<Atom<A>>;
    delete_by_id(id: string): Promise<Atom<A>>;
    delete_one(atom: Atom<A>): Promise<Atom<A>>;
    trash_select<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    trash_select_by_id<D extends Depth>(id: string, depth?: D): Promise<Molecule<A, D>>;
    trash_select_one<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    trash_insert_one(atom: Atom<A>): Promise<Atom<A>>;
    trash_delete_one(atom: Atom<A>): Promise<Atom<A>>;
    trash_delete_by_id(id: string): Promise<Atom<A>>;
    protected _select<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>, in_trash?: boolean): Promise<Molecule<A, D>[]>;
    protected _select_by_id<D extends Depth>(id: string, depth?: D, in_trash?: boolean): Promise<Molecule<A, D>>;
    protected _select_one<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>, in_trash?: boolean): Promise<Molecule<A, D>>;
    protected _insert_one(atom_shape: AtomShape<A>, in_trash?: boolean): Promise<Atom<A>>;
    protected _alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>, in_trash?: boolean, fix?: boolean): Promise<Atom<A>>;
    protected _delete_by_id(id: string, in_trash?: boolean): Promise<Atom<A>>;
    protected _encrypt_changed_properties(id: string, atom: Atom<A>): Promise<Atom<A>>;
    protected _encrypt_changed_properties(id: string, atom: Partial<AtomShape<A>>): Promise<Partial<AtomShape<A>>>;
    protected _check_unique(partial_atom: Partial<AtomShape<A>>, id?: string): Promise<true>;
}
export declare function create<A extends AtomName>(atom_name: A): DAL<A>;
