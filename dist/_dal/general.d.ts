/**
 *
 * Implementation of Users Data Access Layer
 *
 * @packageDocumentation
 */
import { DatabaseType, AtomDefinition } from '../types';
import * as urn_atms from '../atm/';
import { DAL } from './abstract';
declare class DALGeneral extends DAL<urn_atms.models.Resource, urn_atms.Atom<urn_atms.models.Resource>> {
    constructor(db_type: DatabaseType, atom_definition: AtomDefinition);
}
export declare type DalGeneralInstance = InstanceType<typeof DALGeneral>;
export declare function create(db_type: DatabaseType, atom_definition: AtomDefinition): DalGeneralInstance;
export {};
