/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import urn_core from 'urn_core';

import {Atom, AtomShape, AtomName} from '../types';

import {create_basic} from './basic';

import {SecurityBLL} from './security';

const group_bll = create_basic('group');

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class AuthBLL<A extends AtomName> extends SecurityBLL<A>{
	
	public async insert_new(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		const atom = await super.insert_new(atom_shape);
		if(!urn_core.atm.is_auth_atom_name(this.atom_name) || !urn_core.atm.is_auth_atom(atom)){
			return atom;
		}
		const group = await group_bll.insert_new({name: atom.email});
		atom.groups = [group._id];
		return await super.update_one(atom);
	}

}

