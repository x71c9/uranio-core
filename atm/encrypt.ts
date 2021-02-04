/**
 * Module for Atom Encryption
 *
 * @packageDocumentation
 */

import {atom_book} from 'urn_book';

import bcrypt from 'bcrypt';

import {urn_util} from 'urn-lib';

import {core_config} from '../conf/defaults';

import {_validate_encrypt_property} from './validate';

import {
	AtomName,
	Atom,
	AtomShape,
	Book,
	BookPropertyType
} from '../types';

export async function encrypt_property<A extends AtomName>
(atom_name:A, prop_key:keyof Atom<A>, prop_value:string)
		:Promise<string>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	_validate_encrypt_property(prop_key, atom_props[prop_key as string] as Book.Definition.Property.Encrypted, prop_value);
	// *********
	// IMPORTANT - If the encryption method is changed,
	// *********   DAL._encrypt_changed_properties must be changed too.
	// *********
	const salt = await bcrypt.genSalt(core_config.encryption_round);
	return await bcrypt.hash(prop_value, salt);
}

export async function encrypt_properties<A extends AtomName>(atom_name:A, atom:AtomShape<A>):Promise<AtomShape<A>>
export async function encrypt_properties<A extends AtomName>(atom_name:A, atom:Partial<AtomShape<A>>)
		:Promise<Partial<AtomShape<A>>>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let k:keyof AtomShape<A>;
	for(k in atom){
		if(
			urn_util.object.has_key(atom_props, k) &&
			atom_props[k] &&
			atom_props[k].type === BookPropertyType.ENCRYPTED
		){
			atom[k] = await encrypt_property<A>(atom_name, k, atom[k] as string) as any;
		}
	}
	return atom;
}

