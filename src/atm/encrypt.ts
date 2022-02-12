/**
 * Module for schema.Atom Encryption
 *
 * @packageDocumentation
 */

import bcrypt from 'bcryptjs';

import {urn_util} from 'urn-lib';

import * as conf from '../conf/index';

import * as book from '../book/client';

import * as validate from './validate';

// import {
//   schema.AtomName,
//   schema.Atom,
//   schema.AtomShape,
//   Book,
//   BookProperty
// } from '../cln/types';

import {Book, BookProperty} from '../cln/types';

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

export async function property<A extends schema.AtomName, D extends schema.Depth = 0>
(atom_name:A, prop_key:keyof schema.Molecule<A,D>, prop_value:string)
		:Promise<string>{
	const prop_def = book.get_property_definition(atom_name, prop_key as string);
	validate.encrypt_property(prop_key, prop_def as Book.Definition.Property.Encrypted, prop_value);
	// *********
	// IMPORTANT - If the encryption method is changed,
	// *********   DAL._encrypt_changed_properties must be changed too.
	// *********
	const salt = await bcrypt.genSalt(conf.get(`encryption_rounds`));
	return await bcrypt.hash(prop_value, salt);
}

export async function properties<A extends schema.AtomName>(atom_name:A, atom:schema.AtomShape<A>):Promise<schema.AtomShape<A>>
export async function properties<A extends schema.AtomName>(atom_name:A, atom:Partial<schema.AtomShape<A>>):Promise<Partial<schema.AtomShape<A>>>
export async function properties<A extends schema.AtomName>(atom_name:A, atom:schema.AtomShape<A> | Partial<schema.AtomShape<A>>):Promise<schema.AtomShape<A> | Partial<schema.AtomShape<A>>>{
	const prop_defs = book.get_custom_property_definitions(atom_name);
	let k:keyof schema.AtomShape<A>;
	for(k in atom){
		if(urn_util.object.has_key(prop_defs, k)){
			const prop = prop_defs[k];
			if(prop && prop.type === BookProperty.ENCRYPTED){
				atom[k] = await property<A>(atom_name, k, String(atom[k])) as any;
			}
		}
	}
	return atom;
}

