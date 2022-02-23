/**
 * Auth types module
 *
 * @packageDocumentation
 */

import {abstract_passport} from '../stc/server';

import {PassportKey} from './intra';

type MapType<T> =
	T extends 'string' ? string :
	T extends 'string[]' ? string[] :
	T extends 'number' ? number :
	T extends 'number[]' ? number[] :
	T extends 'boolean' ? boolean :
	never;

export type Passport = {
	[k in PassportKey]: MapType<typeof abstract_passport[k]>
}

// With "const" typescript will no transpile any code and delete the reference.
// While without "const" ts will tranpile in a JS object. So it is possible to
// check if a value is included in the enum.
// https://thisthat.dev/const-enum-vs-enum/
// It is possible to preserve the const with "preserveConstEnums" in tsconfig
export enum AuthAction {
	READ = 'READ',
	WRITE = 'WRITE',
	AUTH = 'AUTH'
}
