/**
 * Required module
 *
 * @packageDocumentation
 */

import {atom_book} from '../atoms';

import * as types from '../client/types';

export function get():types.Book{
	return {
		...atom_book
	};
}
