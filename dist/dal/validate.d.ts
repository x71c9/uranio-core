/**
 * Class for Validate Data Access Layer
 *
 * This class will validate all schema.Atom before and after saving to the db.
 * If the Atoms are not valid it will throw Exceptions.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { RelationDAL } from './rel';
export declare class ValidateDAL<A extends schema.AtomName> extends RelationDAL<A> {
    select<D extends schema.Depth = 0>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    select_by_id<D extends schema.Depth = 0>(id: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    select_one<D extends schema.Depth = 0>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    insert_one(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>>;
    delete_by_id(id: string): Promise<schema.Atom<A>>;
    alter_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    delete_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
    protected _check_unique_multiple(partial_atoms: Partial<schema.AtomShape<A>>[]): Promise<true>;
    protected _check_unique_multiple_ids(partial_atom: Partial<schema.AtomShape<A>>, ids: string[]): Promise<true>;
    protected _check_unique(partial_atom: Partial<schema.AtomShape<A>>, id?: string): Promise<true>;
    protected validate(molecule: schema.Atom<A>): Promise<schema.Atom<A>>;
    protected validate(molecule: schema.Atom<A>, depth?: 0): Promise<schema.Atom<A>>;
    protected validate<D extends schema.Depth>(molecule: schema.Molecule<A, D>, depth?: D): Promise<schema.Molecule<A, D>>;
}
export declare function create_validate<A extends schema.AtomName>(atom_name: A): ValidateDAL<A>;
