/**
 * Atom User module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {models, AtomModule, AtomCreateFunction} from '../types';

import {User} from './class';

import {create_atom} from '../abstract';

export type UserInstance = InstanceType<typeof User>;

export const create:AtomCreateFunction<models.User, UserInstance> =
(user) => {
	
	urn_log.fn_debug(`User create`);
	
	return create_atom(user, User);
	
};

export const module:AtomModule<models.User, User> = {
	create: create,
	keys: models.user.keys,
	relation_name: 'urn_user'
};

