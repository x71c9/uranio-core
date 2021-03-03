
import * as types from './typ/';

export const atom = {
	superuser: {
		security: {
			type: types.BookSecurityType.UNIFORM,
			_r: types.BookPermissionType.NOBODY
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
		properties: {
			name: {
				type: types.BookPropertyType.TEXT,
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

export const api = {
	superuser: {
		api:{
			url: 'superusers',
			auth: 'superauth'
		}
	},
	user: {
		api:{
			url: 'users',
			auth: 'auth'
		}
	},
	group: {
		api:{
			url: 'groups'
		}
	}
} as const;
