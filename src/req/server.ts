/**
 * Required module
 *
 * @packageDocumentation
 */

import {atom_book} from '../atoms';

import * as conf from '../conf/server';

import * as types from '../client/types';

export function get():types.Book{
	if(conf.get('default_atoms_superuser') === false){
		delete (atom_book as any)._superuser;
	}
	if(conf.get('default_atoms_group') === false){
		delete (atom_book as any)._group;
	}
	if(conf.get('default_atoms_user') === false){
		delete (atom_book as any)._user;
	}
	if(conf.get('default_atoms_media') === false){
		delete (atom_book as any)._media;
	}
	return {
		...atom_book
	};
}
