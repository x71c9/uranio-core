/**
 * Types for Relation module
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
export interface Relation<A extends schema.AtomName> {
    select<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    select_by_id<D extends schema.Depth>(id: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    select_one<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    count(query: schema.Query<A>): Promise<number>;
    insert_one(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    alter_by_id<D extends schema.Depth>(id: string, partial_atom: Partial<schema.AtomShape<A>>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    replace_by_id(id: string, atom: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    delete_by_id(id: string): Promise<schema.Atom<A>>;
    is_valid_id(id: string): boolean;
    alter_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    delete_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
}
