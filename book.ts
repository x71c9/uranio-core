
import * as book_types from './types';

export const core_atom_book = {
	superuser: {
		security: {
			type: book_types.BookSecurityType.UNIFORM,
			_r: null
		},
		api:{
			url: '/superusers'
		},
		properties: {
			email: {
				type: book_types.BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
				on_error: () => {
					return 'email@email.com';
				}
			},
			password: {
				type: book_types.BookPropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			}
		}
	},
	user: {
		security: {
			type: book_types.BookSecurityType.GRANULAR
		},
		api:{
			url: '/users'
		},
		properties: {
			email: {
				type: book_types.BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
			},
			password: {
				type: book_types.BookPropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: book_types.BookPropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		}
	},
	group: {
		api:{
			url: '/groups'
		},
		properties: {
			name: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Name'
			}
		}
	}
} as const;

export const atom_book = {
	...core_atom_book
} as const;
