/**
 * Class for Validate Data Access Layer
 *
 * @packageDocumentation
 */
import { Depth, Query, AtomName, AtomShape, Atom, Molecule } from '../types';
import { BasicDAL } from './basic';
export declare class ValidateDAL<A extends AtomName> extends BasicDAL<A> {
    constructor(atom_name: A);
    select<D extends Depth = 0>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    select_by_id<D extends Depth = 0>(id: string, depth?: D): Promise<Molecule<A, D>>;
    select_one<D extends Depth = 0>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    insert_one(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    delete_by_id(id: string): Promise<Atom<A>>;
    protected _check_unique(partial_atom: Partial<AtomShape<A>>, id?: string): Promise<true>;
    protected validate(molecule: Atom<A>): Promise<Atom<A>>;
    protected validate(molecule: Atom<A>, depth?: 0): Promise<Atom<A>>;
    protected validate<D extends Depth>(molecule: Molecule<A, D>, depth?: D): Promise<Molecule<A, D>>;
}
export declare function create_validate<A extends AtomName>(atom_name: A): ValidateDAL<A>;
