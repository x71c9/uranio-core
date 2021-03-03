
import * as types from './typ/';

export const core_atom_book = {
	superuser: {
		security: {
			type: types.BookSecurityType.UNIFORM,
			_r: types.BookPermissionType.NOBODY
		},
		api:{
			url: 'superusers',
			auth: 'superauth'
		},
		properties: {
			email: {
				type: types.BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
				on_error: () => {
					return 'email@email.com';
				}
			},
			password: {
				type: types.BookPropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: types.BookPropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		}
	},
	user: {
		security: {
			type: types.BookSecurityType.GRANULAR
		},
		api:{
			url: 'users',
			auth: 'auth'
		},
		properties: {
			email: {
				type: types.BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
			},
			password: {
				type: types.BookPropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: types.BookPropertyType.ATOM_ARRAY,
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
				type: types.BookPropertyType.TEXT,
				unique: true,
				label: 'Name'
			}
		}
	}
} as const;
