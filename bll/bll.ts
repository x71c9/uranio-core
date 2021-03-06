/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {
	AtomName,
} from '../typ/';

import {AuthBLL} from './auth';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class BLL<A extends AtomName> extends AuthBLL<A>{}

