
import * as book_types from './types';

export const core_atom_book = {
	log: {
		connection: 'log',
		security: {
			type: book_types.BookSecurityType.UNIFORM,
			_r: null
		},
		api:{
			url: '/log'
		},
		properties: {
			msg: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Message'
			},
			type: {
				type: book_types.BookPropertyType.ENUM_STRING,
				label: 'Type',
				values: ['debug', 'warning', 'error']
			}
		}
	},
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
				label: 'Password'
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
				label: 'Password'
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
