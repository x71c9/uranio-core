/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import * as urn_atms from '../atm/';
import * as urn_dals from '../dal/';
import { QueryOptions, FilterType } from '../types';
export declare abstract class BLL<M extends urn_atms.models.Resource, A extends urn_atms.Atom<M>> {
    protected _dal: urn_dals.DAL<M, A>;
    constructor();
    protected abstract get_dal(): urn_dals.DAL<M, A>;
    protected abstract create_atom(resource: M): A;
    search(filter: FilterType<M>, options?: QueryOptions<M>): Promise<A[]>;
    search_by_id(id: string): Promise<A>;
    search_one(filter: FilterType<M>, options?: QueryOptions<M>): Promise<A>;
    save_one(resource: M): Promise<A>;
    update_one(resource: M): Promise<A>;
    remove_one(resource: M): Promise<A>;
}
