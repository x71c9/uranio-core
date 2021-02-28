
import * as book_types from './typ/';

export const core_atom_book = {
	superuser: {
		security: {
			type: book_types.BookSecurityType.UNIFORM,
			_r: book_types.BookPermissionType.NOBODY
		},
		api:{
			url: 'superusers',
			auth: 'superauth'
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
			},
			groups: {
				type: book_types.BookPropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		}
	},
	user: {
		security: {
			type: book_types.BookSecurityType.GRANULAR
		},
		api:{
			url: 'users',
			auth: 'auth'
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
			url: 'groups'
		},
		properties: {
			name: {
				type: book_types.BookPropertyType.TEXT,
				unique: true,
				label: 'Name'
			}
		}
	}
} as const;

export const atom_book = {
	...core_atom_book
} as const;
