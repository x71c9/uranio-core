/**
 * Register module for URANIO Api
 *
 * @packageDocumentation
 */

import {register} from '../reg/server';

import {atom_book} from '../atoms';

import {schema} from '../sch/server';

for(const [atom_name, atom_def] of Object.entries(atom_book)){
	register(atom_def as any, atom_name as schema.AtomName);
}
