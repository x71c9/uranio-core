/**
 * Util module for Atom Book
 *
 * @packageDocumentation
 */

import {urn_util} from 'urn-lib';

import {AtomName, KeysOfAtom, AtomProperties, AtomProperty} from '../types';

import {atom_book} from '../book';

export function get_unique_keys<A extends AtomName>(atom_name:A)
		:Set<KeysOfAtom<A>>{
	const unique_keys = new Set<KeysOfAtom<A>>();
	const atom_properties = atom_book[atom_name]['properties'] as AtomProperties;
	for(const k in atom_properties){
		const prop:AtomProperty = atom_properties[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as KeysOfAtom<A>);
		}
	}
	return unique_keys;
}
