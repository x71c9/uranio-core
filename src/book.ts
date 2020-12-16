
import {AtomPropertyType} from './types';

const core_atoms_book = {
	superuser: {
		properties: {
			email: {
				type: AtomPropertyType.EMAIL,
				label: 'Email',
				unique: true
			},
			password: {
				type: AtomPropertyType.ENCRYPTED,
				label: 'Email'
			}
		}
	}
} as const;

export const atom_book = {
	...core_atoms_book,
	product: {
		properties: {
			title: {
				type: AtomPropertyType.TEXT,
				label: 'Title'
			},
			barcode: {
				type: AtomPropertyType.TEXT,
				label: 'Barcode',
				optional: true
			}
		}
	},
	obi: {
		properties: {
			other_id: {
				type: AtomPropertyType.ID,
				label: 'Other ID'
			},
			label: {
				type: AtomPropertyType.TEXT,
				label: 'Label',
				validation: {
					alphanum: true,
					lowercase: true,
					max: 255
				}
			},
			bio: {
				type: AtomPropertyType.LONG_TEXT,
				label: 'Bio',
				optional: true
			},
			mail: {
				type: AtomPropertyType.EMAIL,
				label: 'Mail'
			},
			age: {
				type: AtomPropertyType.INTEGER,
				label: 'Age',
				validation: {
					min: 18
				}
			},
			price: {
				type: AtomPropertyType.FLOAT,
				label: 'Price',
				format: {
					decimal: 2,
					decimal_point: '_',
					thousands_step: '-'
				},
				validation: {
					eq: 1800.99
				}
			},
			active: {
				type: AtomPropertyType.BINARY,
				label: 'Active',
				default: true,
				values: ['Inactive', 'Active']
			},
			password: {
				type: AtomPropertyType.ENCRYPTED,
				label: 'Password',
				validation: {
					contain_number: true,
					contain_lowercase: true,
					contain_uppercase: true,
					min: 8
				}
			},
			confirmation_date: {
				type: AtomPropertyType.TIME,
				label: 'Confirmation',
				validation: {
					min: '1986-03-22',
					max: '2020-12-15'
				}
			},
			categories: {
				type: AtomPropertyType.SET,
				values: ['CatA', 'CatB', 2],
				label: 'Categories',
				validation: {
					length: 1
				}
			},
			media: {
				type: AtomPropertyType.ATOM,
				atom: 'superuser',
				label: 'Media',
				validation: {
					date_from: '1986-03-22',
					date_to: '1970-01-01'
				}
			}
		}
	}
} as const;
