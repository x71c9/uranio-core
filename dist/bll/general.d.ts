/**
 *
 * Implementation of Users Business Logic Layer
 *
 * @packageDocumentation
 */
import { AtomDefinition } from '../types';
import * as urn_atms from '../atm/';
import * as urn_dals from '../dal/';
import { BLL } from './abstract';
declare class BLLGeneral extends BLL<urn_atms.models.Resource, urn_atms.Atom<urn_atms.models.Resource>> {
    private atom_definition;
    constructor(atom_definition: AtomDefinition);
    protected get_dal(): urn_dals.general.DalGeneralInstance;
    protected create_atom(resource: urn_atms.models.Resource): urn_atms.Atom;
}
export declare type BllGeneralInstance = InstanceType<typeof BLLGeneral>;
export declare function create(atom_definition: AtomDefinition): BllGeneralInstance;
export {};
