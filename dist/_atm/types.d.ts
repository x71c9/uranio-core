/**
 *
 * Atom type module
 *
 * @packageDocumentation
 */
import urn_mdls from 'urn-mdls';
export import models = urn_mdls.resources;
import { Atom } from './abstract';
import { RelationName } from '../types';
export declare type AtomCreateFunction<M extends models.Resource, A extends Atom<M>> = (resource: M) => A;
export declare type AtomModule<M extends models.Resource, A extends Atom<M>> = {
    create: AtomCreateFunction<M, A>;
    keys: models.ModelKeysCategories<M>;
    relation_name: RelationName;
};
export declare type TokenObject = {
    _id: string;
    name: string;
};
