/**
 * Register module for URANIO Core.
 *
 * There is no actual need for this module but to make everything equal
 * between repos [core, api, trx, ...].
 *
 * Plus the script `yarn types` will fail if it does not found this file.
 *
 * @packageDocumentation
 */

import {register} from './reg/index';

import {atom_book} from './atoms';

for(const [atom_name, atom_def] of Object.entries(atom_book)){
	register(atom_def as any, atom_name);
}
