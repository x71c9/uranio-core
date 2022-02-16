/**
 * Atom book
 *
 * @packageDocumentation
 */

// import schema from 'uranio-schema';

// import {schema} from './sch/index';

import {BookProperty, BookSecurity, BookPermission} from './typ/book_srv';

export const atom_book = {
	superuser: {
		authenticate: true,
		plural: 'superusers',
		security: {
			type: BookSecurity.UNIFORM,
			_r: BookPermission.NOBODY
		},
		properties: {
			email: {
				type: BookProperty.EMAIL,
				label: 'Email',
				unique: true,
				on_error: () => {
					return 'email@email.com';
				}
			},
			password: {
				type: BookProperty.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: BookProperty.ATOM_ARRAY,
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
			type: BookSecurity.GRANULAR
		},
		properties: {
			email: {
				type: BookProperty.EMAIL,
				label: 'Email',
				unique: true,
			},
			password: {
				type: BookProperty.ENCRYPTED,
				label: 'Password',
				hidden: true
			},
			groups: {
				type: BookProperty.ATOM_ARRAY,
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
				type: BookProperty.TEXT,
				unique: true,
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
				type: BookProperty.TEXT,
				label: 'SRC',
			},
			filename: {
				primary: true,
				type: BookProperty.TEXT,
				label: 'Filename'
			},
			type: {
				type: BookProperty.TEXT,
				label: 'Filetype'
			},
			size: {
				type: BookProperty.INTEGER,
				label: 'Size (byte)',
				validation: {
					min: 0
				}
			},
			width: {
				optional: true,
				type: BookProperty.INTEGER,
				label: 'Width',
				validation: {
					min: 0
				}
			},
			height: {
				optional: true,
				type: BookProperty.INTEGER,
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
