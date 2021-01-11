/**
 * Class for Access Control Layer
 *
 * @packageDocumentation
 */
import * as urn_dal from '../dal/';
import { Query, AtomName, Atom, AtomShape, Depth, Molecule, BookPropertyType, BookSecurityType, RealType, AccessLayer } from '../types';
export declare class ACL<A extends AtomName> implements AccessLayer<A> {
    atom_name: A;
    protected user_groups: RealType<BookPropertyType.ID>[];
    protected _dal: urn_dal.DAL<A>;
    protected _security_type: BookSecurityType;
    protected _read?: RealType<BookPropertyType.ID>;
    protected _write?: RealType<BookPropertyType.ID>;
    protected _read_query: Query<A>;
    constructor(atom_name: A, user_groups: RealType<BookPropertyType.ID>[]);
    protected _can_uniform_read(): void;
    protected _can_uniform_write(): void;
    protected _can_atom_write(id: string): Promise<boolean>;
    filter_uniform_bond_properties<D extends Depth>(molecule: Molecule<A, D>, depth?: number): Molecule<A, D>;
    select<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>[]>;
    select_by_id<D extends Depth>(id: string, depth?: D): Promise<Molecule<A, D>>;
    select_one<D extends Depth>(query: Query<A>, options?: Query.Options<A, D>): Promise<Molecule<A, D>>;
    insert_one(atom_shape: AtomShape<A>): Promise<Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<AtomShape<A>>): Promise<Atom<A>>;
    delete_by_id(id: string): Promise<Atom<A>>;
}
export declare function create<A extends AtomName>(atom_name: A, user_groups: RealType<BookPropertyType.ID>[]): ACL<A>;
