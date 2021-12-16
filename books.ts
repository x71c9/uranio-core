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
	},
	media: {
		plural: 'media',
		properties: {
			src: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'SRC',
			},
			filename: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Filename'
			},
			type: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Filetype'
			},
			size: {
				type: uranio.types.BookPropertyType.INTEGER,
				label: 'Size (byte)',
				validation: {
					min: 0
				}
			},
			width: {
				optional: true,
				type: uranio.types.BookPropertyType.INTEGER,
				label: 'Width',
				validation: {
					min: 0
				}
			},
			height: {
				optional: true,
				type: uranio.types.BookPropertyType.INTEGER,
				label: 'Height',
				validation: {
					min: 0
				}
			}
		}
	}
} as const;

export const bll = {
	superuser:{},
	user:{},
	group:{},
	media: {
		bll: {
			class: (passport?:uranio.types.Passport) => {
				return uranio.bll.media.create(passport);
			}
		}
	}
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
	},
	media: {
		dock:{
			url: '/media'
		}
	}
} as const;

