/**
 *
 * Atom type module
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import models = urn_mdls.resources;

import {Atom} from './abstract';

import {RelationName} from '../types';

export type AtomCreateFunction<M extends models.Resource, A extends Atom<M>> =
	(resource:M) => A;

export type AtomModule<M extends models.Resource, A extends Atom<M>> = {
	create: AtomCreateFunction<M,A>,
	keys: models.ModelKeysCategories<M>,
	relation_name: RelationName
}
