/**
 * Auth types module
 *
 * @packageDocumentation
 */

import {abstract_token_object} from './static';

export type MapType<T> =
	T extends 'string' ? string :
	T extends 'string[]' ? string[] :
	T extends 'number' ? number :
	T extends 'number[]' ? number[] :
	T extends 'boolean' ? boolean :
	never;

export type TokenKey = keyof typeof abstract_token_object;

export type TokenObject = {
	[k in TokenKey]: MapType<typeof abstract_token_object[k]>
}

export const enum AuthAction {
	READ = 'READ',
	WRITE = 'WRITE',
	AUTH = 'AUTH'
}
