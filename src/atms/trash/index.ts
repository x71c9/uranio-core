/**
 * Atom User module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {models, AtomModule, AtomCreateFunction} from '../types';

import {Trash} from './class';

import {create_atom} from '../atom';

export type TrashInstance = InstanceType<typeof Trash>;

const create:AtomCreateFunction<models.Trash, TrashInstance> =
(trash) => {
	
	urn_log.fn_debug(`Trash create`);
	
	return create_atom(trash, Trash);
	
};

export const module:AtomModule<models.Trash, Trash> = {
	create: create,
	keys: models.trash.keys,
	relation_name: 'urn_trash'
};

