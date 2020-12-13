
import {AtomPropertyType} from './types';

const core_atoms_book = {
	superuser: {
		properties: {
			email: {
				type: AtomPropertyType.EMAIL,
				label: 'Email',
				required: true,
				unique: true
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
			title: {
				type: AtomPropertyType.TEXT,
				label: 'Title',
				required: true
			},
			barcode: {
				type: AtomPropertyType.TEXT,
				label: 'Barcode'
			}
		},
		mongo_schema: {}
	}
} as const;
