/**
 * Class for Access Control Layer
 *
 * The Access Control Layer is an Access Layer that will check if it is possible
 * to make the query and filters the results with only the accessible data.
 *
 * The permission on each Relation can be UNIFORM or GRANULAR.
 *
 * Default is UNIFORM.
 *
 * UNIFORM permission will check on a Relation level.
 * GRANULAR permission will check on a Record level.
 *
 * In order to the ACL to work, it needs User and Group Relations.
 * Each request is made by an User. Each User has Groups.
 *
 * Each Relation / Record has two attributes _r and _w, respectively for reading
 * and writing permission. The value of these attributes is a Group ID Array.
 *
 * _r will narrow from Everybody
 * _w will widen from Nobody
 *
 * _r == nullish -> Everybody can read
 * _w == nullish -> Nobody can write
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import * as urn_dal from '../dal/server';
import { SecurityType } from '../typ/book';
import { AuthAction } from '../typ/auth';
import { AccessLayer } from '../typ/layer';
export declare class ACL<A extends schema.AtomName> implements AccessLayer<A> {
    atom_name: A;
    protected user_groups: string[];
    protected _dal: urn_dal.DAL<A>;
    protected _security_type: SecurityType;
    protected _read?: string;
    protected _write?: string;
    protected _read_query: schema.Query<A>;
    constructor(atom_name: A, user_groups: string[]);
    protected _can_uniform_read(): void;
    protected _can_uniform_write(): void;
    protected _can_atom_write(id: string): Promise<boolean>;
    protected _can_atom_write_multiple(ids: string[]): Promise<boolean>;
    filter_uniform_bond_properties<D extends schema.Depth>(molecule: schema.Molecule<A, D>, depth?: number): schema.Molecule<A, D>;
    select<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    select_by_id<D extends schema.Depth>(id: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    select_one<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    count(query: schema.Query<A>): Promise<number>;
    insert_one(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    alter_by_id(id: string, partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>>;
    delete_by_id(id: string): Promise<schema.Atom<A>>;
    authorize(action: AuthAction, id?: string): Promise<true>;
    select_multiple<D extends schema.Depth>(ids: string[], options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    alter_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    delete_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
    search<D extends schema.Depth>(string: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
}
export declare function create<A extends schema.AtomName>(atom_name: A, user_groups: string[]): ACL<A>;
