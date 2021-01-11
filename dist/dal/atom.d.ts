/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */
import { DBType } from '../types';
import * as urn_atms from '../atm/';
import { DAL } from './abstract';
declare class DALUsers extends DAL<urn_atms.models.User, urn_atms.user.UserInstance> {
    constructor(db_type: DBType);
}
export declare type DalUsersInstance = InstanceType<typeof DALUsers>;
export declare function create(db_type: DBType): DalUsersInstance;
export {};
