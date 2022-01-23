/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as atm from '../atm/';

import * as insta from '../nst/';

import {Atom, AtomShape, AtomName, AuthAtom} from '../typ/atom';

import {SecurityBLL} from './security';

type GroupsByEmail = {
	[k:string]: Atom<'group'>
}

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
		const group_bll = insta.get_bll_group();
		const group = await group_bll.insert_new({name: atom.email});
		atom.groups = [group._id];
		return await super.update_one(atom);
	}
	
	public async insert_multiple(atom_shapes:AtomShape<A>[])
			:Promise<Atom<A>[]>{
		const atoms = await super.insert_multiple(atom_shapes);
		if(
			!atm.util.is_auth_atom_name(this.atom_name) ||
			!atm.util.is_auth_atom(atoms[0])
		){
			return atoms;
		}
		const group_bll = insta.get_bll_group();
		const group_shapes = [];
		for(const atom of atoms){
			group_shapes.push({name: (atom as unknown as AuthAtom<'user'>).email});
		}
		const groups = await group_bll.insert_multiple(group_shapes);
		const groups_by_email:GroupsByEmail = {};
		for(const group of groups){
			groups_by_email[group.name] = group;
		}
		const atoms_with_group = [];
		for(const atom of atoms){
			const auth_atom = atom as unknown as AuthAtom<'user'>;
			auth_atom.groups = [groups_by_email[auth_atom.email]._id];
			const atom_with_group = await super.update_one(auth_atom as unknown as Atom<A>);
			atoms_with_group.push(atom_with_group);
		}
		return atoms_with_group;
	}
	
}
