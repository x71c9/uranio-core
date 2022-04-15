/**
 * Class for Basic Business Logic Layer
 *
 * It is a mirror of a Data Access Layer.
 * The method _get_access_layer can be overwritten when extending the class.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { AuthAction } from '../typ/auth';
import { AccessLayer } from '../typ/layer';
export declare class BasicBLL<A extends schema.AtomName> {
    atom_name: A;
    protected _al: AccessLayer<A>;
    constructor(atom_name: A, init_access_layer?: () => AccessLayer<A>);
    find<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    find_by_id<D extends schema.Depth>(id: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    find_one<D extends schema.Depth>(query: schema.Query<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    count(query: schema.Query<A>): Promise<number>;
    insert_new(atom_shape: schema.AtomShape<A>): Promise<schema.Atom<A>>;
    update_by_id<D extends schema.Depth>(id: string, partial_atom: Partial<schema.AtomShape<A>>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    update_one<D extends schema.Depth>(atom: schema.Atom<A>, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>>;
    remove_by_id(id: string): Promise<schema.Atom<A>>;
    remove_one<D extends schema.Depth>(molecule: schema.Molecule<A, D>): Promise<schema.Atom<A>>;
    authorize(action: AuthAction, id?: string): Promise<true>;
    find_multiple<D extends schema.Depth>(ids: string[], options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    update_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<A>>): Promise<schema.Atom<A>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<A>[]): Promise<schema.Atom<A>[]>;
    remove_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
    search<D extends schema.Depth>(string: string, options?: schema.Query.Options<A, D>): Promise<schema.Molecule<A, D>[]>;
    search_count(string: string): Promise<number>;
}
export declare function create<A extends schema.AtomName>(atom_name: A): BasicBLL<A>;
