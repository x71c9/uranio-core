/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {Atom} from '../atom';

import {models} from '../types';

export const trash_keys:models.ModelKeysCategories<models.Trash> =
	models.trash.keys;

/**
 * Class for Atom User
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class Trash extends Atom<models.Trash> implements models.Trash {
	
	public record:models.Resource;
	
	constructor(trash:models.Trash){
		
		super(trash);
		
		this.record = trash.record;
		
	}
	
	protected _get_keys()
			:models.ModelKeysCategories<models.Trash>{
		return trash_keys;
	}
	
}
