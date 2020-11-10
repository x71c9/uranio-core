/**
 * Atom User module
 *
 * @packageDocumentation
 */

import urn_mdls from 'urn-mdls';

import {urn_log} from 'urn-lib';

import * as urn_db from '../../db/';

import {AtomCreateFunction, AtomModule} from '../types';

import {user_schema_definition} from './schema';

import {User, user_keys} from './class';

import {create_atom} from '../atom';

export type UserInstance = InstanceType<typeof User>;

export namespace models {
	
	export type User = urn_mdls.resources.User;
	
}

const schema:urn_db.Schema = new urn_db.Schema(user_schema_definition);

const create:AtomCreateFunction<models.User, UserInstance> =
(user) => {
	
	urn_log.fn_debug(`User create`);
	
	return create_atom(user, User);
	
};

export const module:AtomModule<models.User, User> = {
	
	keys: user_keys,
	
	create: create,
	
	schema: schema
	
};

