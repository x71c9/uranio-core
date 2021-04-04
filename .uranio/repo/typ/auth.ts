/**
 * Auth types module
 *
 * @packageDocumentation
 */

import {abstract_passport} from './static';

export type MapType<T> =
	T extends 'string' ? string :
	T extends 'string[]' ? string[] :
	T extends 'number' ? number :
	T extends 'number[]' ? number[] :
	T extends 'boolean' ? boolean :
	never;

export type PassportKey = keyof typeof abstract_passport;

export type Passport = {
	[k in PassportKey]: MapType<typeof abstract_passport[k]>
}

export const enum AuthAction {
	READ = 'READ',
	WRITE = 'WRITE',
	AUTH = 'AUTH'
}
