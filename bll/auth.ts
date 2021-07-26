/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as atm from '../atm/';

import * as bll from '../bll/';

import {Atom, AtomShape, AtomName} from '../typ/';

import {create as create_basic} from './basic';

import {SecurityBLL} from './security';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class AuthBLL<A extends AtomName> extends SecurityBLL<A>{
	
	public async insert_new(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		const atom = await super.insert_new(atom_shape);
		if(
			!atm.util.is_auth_atom_name(this.atom_name) ||
			!atm.util.is_auth_atom(atom)
		){
			return atom;
		}
		const group_bll = _get_group_bll();
		const group = await group_bll.insert_new({name: atom.email});
		atom.groups = [group._id];
		return await super.update_one(atom);
	}
	
}

let common_group_bll:bll.BLL<'group'> | undefined = undefined;

function _get_group_bll(){
	if(!common_group_bll){
		common_group_bll = create_basic('group');
	}
	return common_group_bll;
}
