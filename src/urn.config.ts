
// import mongoose from 'mongoose';

import {AtomPropertyType} from './types';

const core_atoms_book = {
	superuser: {
		properties: {
			email: {
				type: AtomPropertyType.EMAIL,
				label: 'Email',
				required: true
			},
			password: {
				type: AtomPropertyType.ENCRYPTED,
				label: 'Email',
				required: true
			}
		},
		mongo_schema: {}
	}
} as const;

export const atom_book = {
	...core_atoms_book,
	product: {
		properties: {
			_id: {
				type: AtomPropertyType.INTEGER,
				label: '_id'
			},
			title: {
				type: AtomPropertyType.TEXT,
				label: 'Title',
				required: true
			}
		},
		mongo_schema: {}
	}
} as const;
