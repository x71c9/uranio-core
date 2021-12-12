/**
 * Required CORE books
 *
 * @packageDocumentation
 */

import uranio from 'uranio';

export const atom = {
	superuser: {
		authenticate: true,
		plural: 'superusers',
		security: {
			type: uranio.types.BookSecurityType.UNIFORM,
			_r: uranio.types.BookPermissionType.NOBODY
		},
		properties: {
			email: {
				type: uranio.types.BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
				on_error: () => {
					return 'email@email.com';
				}
			},
			password: {
				type: uranio.types.BookPropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: uranio.types.BookPropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		}
	},
	user: {
		authenticate: true,
		plural: 'users',
		security: {
			type: uranio.types.BookSecurityType.GRANULAR
		},
		properties: {
			email: {
				type: uranio.types.BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
			},
			password: {
				type: uranio.types.BookPropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: uranio.types.BookPropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		}
	},
	group: {
		plural: 'groups',
		properties: {
			name: {
				type: uranio.types.BookPropertyType.TEXT,
				unique: true,
				label: 'Name'
			}
		}
	}
} as const;

export const bll = {
	superuser:{},
	user:{},
	group:{}
} as const;

export const dock = {
	superuser: {
		dock:{
			url: '/superusers',
			auth: '/superauth'
		}
	},
	user: {
		dock:{
			url: '/users',
			auth: '/auth'
		}
	},
	group: {
		dock:{
			url: '/groups'
		}
	}
} as const;

