/**
 *
 * Implementation of Users Business Logic Layer
 *
 * @packageDocumentation
 */
import * as urn_atms from '../atm/';
import * as urn_dals from '../dal/';
import { BLL } from './abstract';
declare class BLLAtom extends BLL<urn_atms.models.Resource, urn_atms.Atom<urn_atms.models.Resource>> {
    constructor();
    protected get_dal(): urn_dals.users.DalUsersInstance;
    protected create_atom(resource: urn_atms.models.User): urn_atms.user.UserInstance;
}
export declare type BllAtomInstance = InstanceType<typeof BLLAtom>;
export declare function create(): BllAtomInstance;
export {};
