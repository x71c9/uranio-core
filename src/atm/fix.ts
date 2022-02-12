/**
 * Module for schema.Atom Util
 *
 * @packageDocumentation
 */

// import {urn_exception, urn_util} from 'urn-lib';
import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_FIX', `schema.Atom Fix module`);

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

import * as validate from './validate';

import {Book} from '../typ/book_cln';

import * as book from '../book/client';

// export function property<A extends schema.AtomName>(
//   atom_name:A,
//   atom:schema.Atom<A>,
//   key:keyof schema.Atom<A>
// ):schema.Atom<A>;
export function property<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	atom:schema.Molecule<A,D>,
	key:keyof schema.Molecule<A,D>
):schema.Molecule<A,D>{
// export function property<A extends schema.AtomName, D extends schema.Depth>(
//   atom_name:A,
//   atom:schema.Atom<A> | schema.Molecule<A,D>,
//   key: keyof schema.Atom<A> | keyof schema.Molecule<A,D>
// ):schema.Atom<A> | schema.Molecule<A,D>{
	const prop_def = book.get_property_definition(atom_name, key as keyof Book.Definition.Properties);
	let fixed_value = null;
	let fix_defined = false;
	if(prop_def.on_error && typeof prop_def.on_error === 'function'){
		fixed_value = prop_def.on_error((atom as any)[key]);
		fix_defined = true;
	}else if(prop_def.default){
		fixed_value = prop_def.default;
		fix_defined = true;
	}
	try{
		
		validate.property(key as keyof schema.Molecule<A,D>, prop_def, fixed_value, atom as schema.Atom<A>);
		(atom as any)[key] = fixed_value;
		
	}catch(err){
		let err_msg = `Cannot fix property of schema.Atom [${atom._id}].`;
		if(fix_defined){
			err_msg += ` Default value or on_error result is invalid.`;
		}else{
			err_msg += ` Fix method not defined.`;
			err_msg += ` Please define a \`default\` value or a \`on_error\` function`;
			err_msg += ` in atom definition.`;
		}
		err_msg += ` For schema.Atom \`${atom_name}\` property \`${key}\``;
		throw urn_exc.create('CANNOT_FIX', err_msg);
	}
	return atom;
}

