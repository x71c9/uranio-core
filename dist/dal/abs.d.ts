/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */
import * as urn_rel from '../rel/';
import { Depth, Query, AtomName, AtomShape, Atom, Molecule } from '../types';
export declare class AbstractDAL<A extends AtomName> {
    atom_name: A;
    protected _db_relation: urn_rel.Relation<A>;
    constructor(atom_name: A, _db_relation: urn_rel.Relation<A>);
    select<D extends Depth = 0>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    select_by_id<D extends Depth = 0>(id: string, depth?: D): Promise<Molecule<A, D>>;
    select_one<D extends Depth = 0>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    insert_one(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    delete_by_id(id: string): Promise<Atom<A>>;
}
export declare function create_abstract<A extends AtomName>(atom_name: A, db_relation: urn_rel.Relation<A>): AbstractDAL<A>;
