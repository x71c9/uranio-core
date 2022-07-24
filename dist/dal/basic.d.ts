/**
 * Class for Basic Data Access Layer
 *
 * This class is a mirror of a Relation.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import * as urn_rel from '../rel/server';
import { AuthAction } from '../typ/auth';
import { AccessLayer } from '../typ/layer';
export declare class BasicDAL<A extends schema.AtomName> implements AccessLayer<A> {
    atom_name: A;
    protected _db_relation: urn_rel.Relation<A>;
    constructor(atom_name: A, _db_relation: urn_rel.Relation<A>);
    is_valid_id(_id: string): boolean;
    select<D extends schema.Depth = 0>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    select_by_id<D extends schema.Depth = 0>(id: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    select_one<D extends schema.Depth = 0>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    count(query: schema.Query<A>): Promise<number>;
    insert_one(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    alter_by_id<D extends schema.Depth>(id: string, partial_atom: Partial<schema.AtomShape<A>>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    delete_by_id(id: string): Promise<schema.Atom<A>>;
    authorize(_action: AuthAction, _id?: string): Promise<true>;
    alter_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    delete_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
    search<D extends schema.Depth = 0>(string: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    search_count(string: string): Promise<number>;
}
export declare function create_basic<A extends schema.AtomName>(atom_name: A, db_relation: urn_rel.Relation<A>): BasicDAL<A>;
