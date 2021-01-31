
import {BookPropertyType, BookSecurityType} from './_core/types';

const core_atoms_book = {
	superuser: {
		security: {
			type: BookSecurityType.UNIFORM,
			_r: null
		},
		properties: {
			email: {
				type: BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
				on_error: () => {
					return 'email@email.com';
				}
			},
			password: {
				type: BookPropertyType.ENCRYPTED,
				label: 'Password'
			}
		}
	},
	user: {
		securiy: {
			type: BookSecurityType.GRANULAR
		},
		properties: {
			email: {
				type: BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
			},
			password: {
				type: BookPropertyType.ENCRYPTED,
				label: 'Password'
			},
			groups: {
				type: BookPropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		}
	},
	group: {
		properties: {
			name: {
				type: BookPropertyType.TEXT,
				label: 'Name'
			}
		}
	}
} as const;

export const atom_book = {
	...core_atoms_book,
} as const;
