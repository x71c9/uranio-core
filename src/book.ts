
import {BookPropertyType} from './types';

const core_atoms_book = {
	superuser: {
		properties: {
			email: {
				type: BookPropertyType.EMAIL,
				label: 'Email',
				unique: true,
				on_error: () => {
					return 'a@a.com';
				}
			},
			password: {
				type: BookPropertyType.ENCRYPTED,
				label: 'Password'
			}
		}
	}
} as const;

export const atom_book = {
	...core_atoms_book,
	product: {
		properties: {
			title: {
				type: BookPropertyType.TEXT,
				default: 'TITLE',
				label: 'Title'
			},
			price: {
				type: BookPropertyType.FLOAT,
				format: {
					decimal: 2,
					decimal_point: '.',
					thousands_step: ','
				},
				validation: {
					
				}
			},
			cover: {
				type: BookPropertyType.ATOM_ARRAY,
				atom: 'media'
			}
		}
	},
	media: {
		properties: {
			src: {
				type: BookPropertyType.TEXT,
				label: 'SRC'
			},
			type: {
				type: BookPropertyType.ENUM_STRING,
				values: ['video', 'image', 'pdf'],
				default: 'image'
			},
			superuser: {
				type: BookPropertyType.ATOM,
				atom: 'superuser',
				// optional: true
			}
		}
	},
	obi: {
		properties: {
			other_id: {
				type: BookPropertyType.ID,
				label: 'Other ID'
			},
			label: {
				type: BookPropertyType.TEXT,
				label: 'Label',
				validation: {
					alphanum: true,
					lowercase: true,
					max: 255
				}
			},
			bio: {
				type: BookPropertyType.LONG_TEXT,
				label: 'Bio',
				optional: true
			},
			mail: {
				type: BookPropertyType.EMAIL,
				label: 'Mail'
			},
			age: {
				type: BookPropertyType.INTEGER,
				label: 'Age',
				on_error: (old_value:unknown) => {
					return (typeof old_value === 'string') ? parseInt(old_value) : 3000;
				},
				validation: {
					min: 18
				}
			},
			price: {
				type: BookPropertyType.FLOAT,
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
				type: BookPropertyType.BINARY,
				label: 'Active',
				default: true,
				values: ['Inactive', 'Active']
			},
			password: {
				type: BookPropertyType.ENCRYPTED,
				label: 'Password',
				validation: {
					contain_digit: true,
					contain_lowercase: true,
					contain_uppercase: true,
					min: 8
				}
			},
			string: {
				type: BookPropertyType.ENCRYPTED,
				label: 'String',
				validation: {
					letters_only: true,
					// uppercase: true,
					min: 5,
					// reg_ex: /[0-9]/g
				}
			},
			confirmation_date: {
				type: BookPropertyType.TIME,
				label: 'Confirmation',
				default: 'NOW',
				validation: {
					min: '1986-03-22',
					max: '2020-12-15'
				}
			},
			categories: {
				type: BookPropertyType.SET_STRING,
				validation: {
					values: ['CatA', 'CatB', 'AAA'],
					length: 2
				}
			},
			type: {
				type: BookPropertyType.ENUM_NUMBER,
				values: [1, 2, 3, 4, 5],
				default: 67
			},
			media: {
				type: BookPropertyType.ATOM,
				atom: 'superuser',
				optional: true,
				label: 'Media',
				validation: {
					date_from: '1986-03-22',
					date_to: '1970-01-01'
				}
			}
		}
	}
} as const;
