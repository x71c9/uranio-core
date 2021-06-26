/**
 * Module for Atom Encryption
 *
 * @packageDocumentation
 */

import {atom_book} from 'uranio-books';

import bcrypt from 'bcryptjs';

import {urn_util} from 'urn-lib';

import {core_config} from '../conf/defaults';

import * as validate from './validate';

import {
	AtomName,
	Atom,
	AtomShape,
	Book,
	BookPropertyType
} from '../typ/';

export async function property<A extends AtomName>
(atom_name:A, prop_key:keyof Atom<A>, prop_value:string)
		:Promise<string>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	validate.encrypt_property(prop_key, atom_props[prop_key as string] as Book.Definition.Property.Encrypted, prop_value);
	// *********
	// IMPORTANT - If the encryption method is changed,
	// *********   DAL._encrypt_changed_properties must be changed too.
	// *********
	const salt = await bcrypt.genSalt(core_config.encryption_round);
	return await bcrypt.hash(prop_value, salt);
}

export async function properties<A extends AtomName>(atom_name:A, atom:AtomShape<A>):Promise<AtomShape<A>>
export async function properties<A extends AtomName>(atom_name:A, atom:Partial<AtomShape<A>>)
		:Promise<Partial<AtomShape<A>>>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let k:keyof AtomShape<A>;
	for(k in atom){
		if(urn_util.object.has_key(atom_props, k)){
			const prop = atom_props[k];
			if(prop && prop.type === BookPropertyType.ENCRYPTED){
				atom[k] = await property<A>(atom_name, k, atom[k] as string) as any;
			}
		}
	}
	return atom;
}

