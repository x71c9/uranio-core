/**
 *
 * Atom type module
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import * as urn_db from '../db/';

import {Atom} from './atom';

export type AtomCreateFunction<M extends urn_mdls.resources.Resource, A extends Atom<M>> =
	(resource:M) => A;

export type AtomModule<M extends urn_mdls.resources.Resource, A extends Atom<M>> = {
	keys: urn_mdls.ModelKeysCategories<M>,
	create: AtomCreateFunction<M,A>,
	schema:urn_db.Schema
}
