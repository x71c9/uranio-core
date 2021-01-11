/**
 *
 * Module for general Atom class
 *
 * @packageDocumentation
 */
import { models } from './types';
/**
 * Class for general Atom
 */
export declare abstract class Atom<Model extends models.Resource> implements models.Resource {
    _id?: string;
    _deleted_from?: string;
    date?: Date;
    constructor(resource: Model);
    abstract get_keys(): models.ModelKeysCategories<Model>;
    return(): Model;
    validate(resource: Model): true | never;
}
export declare function create_atom<M extends models.Resource, A extends Atom<M>>(model_instance: M, atom_class: new (init: M) => A): A;
