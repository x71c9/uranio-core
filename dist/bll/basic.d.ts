/**
 * Class for Basic Business Logic Layer
 *
 * @packageDocumentation
 */
import { AccessLayer, Query, AtomName, Atom, AtomShape, Depth, Molecule } from '../types';
export declare class BasicBLL<A extends AtomName> {
    atom_name: A;
    protected user_groups?: string[] | undefined;
    protected _al: AccessLayer<A>;
    constructor(atom_name: A, user_groups?: string[] | undefined);
    find<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    find_by_id<D extends Depth>(id: string, depth?: D): Promise<Molecule<A, D>>;
    find_one<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    insert_new(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    update_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    update_one(atom: Atom<A>): Promise<Atom<A>>;
    remove_by_id(id: string): Promise<Atom<A>>;
    remove_one(molecule: Molecule<A>): Promise<Atom<A>>;
}
export declare function create_basic<A extends AtomName>(atom_name: A): BasicBLL<A>;
