/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */
import * as urn_atms from '../atm/';
import * as urn_rels from '../rel/';
import { DatabaseType, QueryOptions, FilterType } from '../types';
export declare abstract class DAL<M extends urn_atms.models.Resource, A extends urn_atms.Atom<M>> {
    db_type: DatabaseType;
    private _atom_module;
    protected _db_relation: urn_rels.Relation<M>;
    protected _db_trash_relation: urn_rels.Relation<M> | null;
    constructor(db_type: DatabaseType, _atom_module: urn_atms.AtomModule<M, A>);
    find(filter: FilterType<M>, options?: QueryOptions<M>): Promise<A[]>;
    find_by_id(id: string): Promise<A>;
    find_one(filter: FilterType<M>, options?: QueryOptions<M>): Promise<A>;
    insert_one(atom: A): Promise<A>;
    alter_one(atom: A): Promise<A>;
    delete_one(atom: A): Promise<A>;
    trash_find(filter: FilterType<M>, options?: QueryOptions<M>): Promise<A[]>;
    trash_find_by_id(id: string): Promise<A>;
    trash_find_one(filter: FilterType<M>, options?: QueryOptions<M>): Promise<A>;
    trash_insert_one(atom: A): Promise<A>;
    trash_update_one(atom: A): Promise<A>;
    trash_delete_one(atom: A): Promise<A>;
    private _find;
    private _find_by_id;
    private _find_one;
    private _insert_one;
    private _alter_one;
    private _delete_one;
    private _check_unique;
    private _create_atom;
}
