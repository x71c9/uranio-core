/**
 *
 * Implementation of Users Business Logic Layer
 *
 * @packageDocumentation
 */
import * as urn_atms from '../atm/';
import * as urn_dals from '../dal/';
import { BLL } from './abstract';
declare class BLLUsers extends BLL<urn_atms.models.User, urn_atms.user.UserInstance> {
    constructor();
    protected get_dal(): urn_dals.users.DalUsersInstance;
    protected create_atom(resource: urn_atms.models.User): urn_atms.user.UserInstance;
    save_one(resource: urn_atms.models.User): Promise<import("../atm/user/class").User>;
    authenticate(auth_req: urn_atms.models.UserAuth): Promise<string>;
}
export declare type BllUsersInstance = InstanceType<typeof BLLUsers>;
export declare function create(): BllUsersInstance;
export {};
