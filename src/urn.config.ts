
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
		}
	}
} as const;

export const atom_book = {
	...core_atoms_book,
	products: {
		properties: {
			title: {
				type: AtomPropertyType.TEXT,
				label: 'Title',
				required: true
			}
		}
	}
} as const;
