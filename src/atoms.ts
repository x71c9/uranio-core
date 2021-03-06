/**
 * Atom book
 *
 * @packageDocumentation
 */

import {PropertyType, SecurityType, PermissionType} from './typ/book_cln';

export const atom_book = {
	superuser: {
		authenticate: true,
		plural: 'superusers',
		security: {
			type: SecurityType.UNIFORM,
			_r: PermissionType.NOBODY
		},
		properties: {
			email: {
				type: PropertyType.EMAIL,
				label: 'Email',
				unique: true,
				search: true,
				primary: true,
				on_error: () => {
					return 'email@email.com';
				}
			},
			password: {
				type: PropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: PropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		},
		dock:{
			url: '/superusers',
			auth_url: '/superauth'
		}
	},
	user: {
		authenticate: true,
		plural: 'users',
		security: {
			type: SecurityType.GRANULAR
		},
		properties: {
			email: {
				type: PropertyType.EMAIL,
				label: 'Email',
				search: true,
				primary: true,
				unique: true,
			},
			password: {
				type: PropertyType.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: PropertyType.ATOM_ARRAY,
				atom: 'group',
				label: 'Groups',
				optional: true
			}
		},
		dock:{
			url: '/users',
			auth_url: '/auth'
		}
	},
	group: {
		plural: 'groups',
		properties: {
			name: {
				type: PropertyType.TEXT,
				unique: true,
				primary: true,
				search: true,
				label: 'Name'
			}
		},
		dock:{
			url: '/groups'
		}
	},
	media: {
		plural: 'media',
		properties: {
			src: {
				type: PropertyType.TEXT,
				search: true,
				label: 'SRC',
			},
			filename: {
				primary: true,
				type: PropertyType.TEXT,
				search: true,
				label: 'Filename'
			},
			type: {
				type: PropertyType.TEXT,
				search: true,
				primary: true,
				label: 'Filetype'
			},
			size: {
				type: PropertyType.INTEGER,
				label: 'Size (byte)',
				primary: true,
				validation: {
					min: 0
				}
			},
			width: {
				optional: true,
				type: PropertyType.INTEGER,
				label: 'Width',
				validation: {
					min: 0
				}
			},
			height: {
				optional: true,
				type: PropertyType.INTEGER,
				label: 'Height',
				validation: {
					min: 0
				}
			}
		},
		dock:{
			url: '/media'
		}
	}
} as const;
