/**
 * Auth types module
 *
 * @packageDocumentation
 */

// import {AuthName} from './atom';

export const abstract_token_object = {
	_id: 'string',
	auth_atom_name: 'string',
	groups: 'string[]'
} as const;

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

// export type TokenObject<A extends AuthName> = {
//   _id: string,
//   atom: A,
//   groups: string[]
// }

export const enum AuthAction {
	READ = 'READ',
	WRITE = 'WRITE',
	AUTH = 'AUTH'
}
