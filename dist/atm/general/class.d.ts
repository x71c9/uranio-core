/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */
import { AtomProperties } from '../../types';
import { Atom } from '../abstract';
import { models } from '../types';
/**
 * Class for Atom General
 */
export declare class General extends Atom<models.Resource> implements models.Resource {
    atom_name: string;
    constructor(atom_name: string, resource: models.Resource);
    get_keys(): AtomProperties;
}
