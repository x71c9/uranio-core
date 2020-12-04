/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {AtomProperties} from '../../types';

import {Atom} from '../abstract';

import {models} from '../types';

/**
 * Class for Atom General
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class General extends Atom<models.Resource> implements models.Resource {
	
	constructor(public atom_name:string, resource:models.Resource){
		
		super(resource);
		
	}
	
	@urn_log.decorators.no_debug
	public get_keys()
			:AtomProperties{
		return user_keys;
	}
	
}
