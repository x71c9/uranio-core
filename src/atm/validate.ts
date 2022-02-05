/**
 * Module for schema.Atom Validation
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init(`VALIDATION`, `Validate module`);

// import schema from 'uranio-schema';

import {schema} from '../sch/';

import {
	BookProperty,
} from '../cln/types';

import {Book} from '../cln/types';

import {atom_hard_properties, atom_common_properties} from '../stc/';

// This will import server on client
// import * as conf from '../conf/';

import * as atm_util from './util';

import * as atm_keys from './keys';

import * as book from '../book/client';

export function molecule<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	molecule:schema.Molecule<A,D>,
	depth?:D
):schema.Molecule<A,D>{
	return any(atom_name, molecule, depth);
}

export function any<A extends schema.AtomName>(
	atom_name:A,
	molecule:schema.Atom<A>
):schema.Atom<A>;
export function any<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	molecule:schema.Molecule<A,D>,
	depth?:D
):schema.Molecule<A,D>;
export function any<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	molecule:schema.Molecule<A,D> | schema.Atom<A>,
	depth?:D
):schema.Molecule<A,D> | schema.Atom<A>{
	if(!depth){
		atom(atom_name, molecule as schema.Atom<A>);
	}else{
		molecule_primitive_properties(atom_name, molecule);
		_validate_molecule_bond_properties(atom_name, molecule as schema.Molecule<A,D>, depth);
	}
	return molecule;
}

export function molecule_primitive_properties<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	molecule:schema.Molecule<A,D>
):true{
	_validate_hard_properties(molecule);
	_has_all_properties(atom_name, molecule as schema.AtomShape<A>);
	_has_no_other_properties(atom_name, molecule as Partial<schema.AtomShape<A>>);
	_validate_primitive_properties(atom_name, molecule as Partial<schema.AtomShape<A>>);
	return true;
}

export function atom<A extends schema.AtomName>(atom_name:A, atom:schema.Atom<A>)
		:schema.Atom<A>{
	_validate_hard_properties(atom);
	atom_shape(atom_name, atom);
	return atom;
}

export function atom_shape<A extends schema.AtomName>(atom_name:A, atom_shape:schema.AtomShape<A>)
		:true{
	_has_all_properties(atom_name, atom_shape);
	atom_partial(atom_name, atom_shape as Partial<schema.AtomShape<A>>);
	return true;
}

export function atom_partial<A extends schema.AuthName>(atom_name:A, partial_atom:Partial<schema.AtomShape<A>>):true;
export function atom_partial<A extends schema.AtomName>(atom_name:A, partial_atom:Partial<schema.AtomShape<A>>):true;
export function atom_partial<A extends schema.AtomName>(atom_name:A, partial_atom:Partial<schema.AtomShape<A>>)
		:true{
	_has_no_other_properties(atom_name, partial_atom);
	_validate_primitive_properties(atom_name, partial_atom);
	_validate_partial_atom_bond_properties(atom_name, partial_atom);
	return true;
}

export function property<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property,
	prop_value:unknown,
	atom:schema.Atom<A>
):true{
	try{
		_validate_primitive_type(prop_key, prop_def, prop_value);
		_validate_custom_type(prop_key, prop_def, prop_value);
	}catch(e){
		const exc = e as any;
		if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
			throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, atom, [prop_key]);
		}
		throw exc;
	}
	return true;
}

export function encrypt_property<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property.Encrypted,
	prop_value:string
):true{
	// if(prop_def && prop_def.validation && prop_def.validation.max &&
	//   prop_def.validation.max > conf.get(`max_password_length`)){
	//   prop_def.validation.max = conf.get(`max_password_length`);
	// }
	_custom_validate_string(prop_key, prop_def, prop_value);
	return true;
}


function _has_all_properties<A extends schema.AtomName>(atom_name:A, atom_shape:schema.AtomShape<A>)
		:true{
	const prop_defs = book.get_custom_property_definitions(atom_name);
	const missin_props:string[] = [];
	for(const [k] of Object.entries(prop_defs)){
		if(!atm_util.is_optional_property(atom_name, k as keyof schema.Atom<A>) && !urn_util.object.has_key(atom_shape,k)){
			missin_props.push(k);
		}
	}
	for(const [k] of Object.entries(atom_common_properties)){
		if(!atm_util.is_optional_property(atom_name, k as keyof schema.Atom<A>) && !urn_util.object.has_key(atom_shape,k)){
			missin_props.push(k);
		}
	}
	if(missin_props.length > 0){
		let err_msg = `schema.Atom is missing the following properties:`;
		err_msg += ` [${missin_props.join(', ')}]`;
		throw urn_exc.create_invalid_atom('MISSING_PROP', err_msg, atom_shape, missin_props);
	}
	return true;
}

function _has_no_other_properties<A extends schema.AtomName>(atom_name:A, partial_atom:Partial<schema.AtomShape<A>>)
		:true{
	const prop_defs = book.get_custom_property_definitions(atom_name);
	const extra_props:string[] = [];
	for(const k in partial_atom){
		if(urn_util.object.has_key(atom_hard_properties,k)){
			continue;
		}
		if(urn_util.object.has_key(atom_common_properties,k)){
			continue;
		}
		if(!urn_util.object.has_key(prop_defs,k)){
			extra_props.push(k);
		}
	}
	if(extra_props.length > 0){
		let err_msg = `schema.Atom has invalid properties:`;
		err_msg += ` [${extra_props.join(', ')}]`;
		throw urn_exc.create_invalid_atom('INVALID_EXTRA_PROP', err_msg, partial_atom, extra_props);
	}
	return true;
}

function _validate_hard_properties<A extends schema.AtomName, D extends schema.Depth = 0>(molecule:schema.Molecule<A,D>)
		:true{
	let k: keyof typeof atom_hard_properties;
	for(k in atom_hard_properties){
		try{
			_validate_primitive_type(k, atom_hard_properties[k], molecule[k]);
			_validate_custom_type(k, atom_hard_properties[k], molecule[k]);
		}catch(e){
			const exc = e as any;
			if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
				throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, atom, [k]);
			}
			throw exc;
		}
	}
	return true;
}

/**
 * Primitive properties are properties of type: string, number, array, etc.
 * Primitive properties are not of type: ATOM or ATOM_ARRAY
 */
function _validate_primitive_properties<A extends schema.AtomName>(
	atom_name:A,
	partial_atom:Partial<schema.AtomShape<A>>
):true{
	const props = book.get_custom_property_definitions(atom_name);
	let k:keyof typeof partial_atom;
	for(k in partial_atom){
		let prop_def = undefined;
		if(urn_util.object.has_key(atom_hard_properties, k)){
			prop_def = atom_hard_properties[k];
		}else if(urn_util.object.has_key(atom_common_properties, k)){
			prop_def = atom_common_properties[k];
		}else if(urn_util.object.has_key(props, k)){
			prop_def = props[k];
		}
		if(!prop_def){
			const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${k}\``;
			throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
		}
		if(prop_def.type === BookProperty.ATOM || prop_def.type === BookProperty.ATOM_ARRAY){
			continue;
		}
		try{
			_validate_primitive_type(k as any, prop_def, partial_atom[k]);
			_validate_custom_type(k as any, prop_def, partial_atom[k]);
		}catch(e){
			const exc = e as any;
			if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
				throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [k]);
			}
			throw exc;
		}
	}
	return true;
}

function _validate_partial_atom_bond_properties<A extends schema.AtomName>(
	atom_name:A,
	partial_atom:Partial<schema.AtomShape<A>>
):true{
	const props = book.get_custom_property_definitions(atom_name);
	let k:keyof typeof partial_atom;
	for(k in partial_atom){
		let prop_def = undefined;
		if(urn_util.object.has_key(atom_hard_properties, k)){
			prop_def = atom_hard_properties[k];
		}else if(urn_util.object.has_key(atom_common_properties, k)){
			prop_def = atom_common_properties[k];
		}else if(urn_util.object.has_key(props, k)){
			prop_def = props[k];
		}
		if(!prop_def){
			const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${k}\``;
			throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
		}
		
		if(prop_def.type !== BookProperty.ATOM && prop_def.type !== BookProperty.ATOM_ARRAY){
			continue;
		}
		
		try{
			_validate_primitive_type(k as any, prop_def, partial_atom[k]);
		}catch(e){
			const exc = e as any;
			if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
				throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [k]);
			}
			throw exc;
		}
	}
	return true;
}

function _validate_molecule_bond_properties<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	molecule: schema.Molecule<A,D>,
	depth?:D
):true{
	const props = book.get_custom_property_definitions(atom_name);
	const bond_keys = atm_keys.get_bond<A,D>(atom_name);
	for(const k of bond_keys){
		let prop_def = undefined;
		if(urn_util.object.has_key(atom_hard_properties, k)){
			prop_def = atom_hard_properties[k];
		}else if(urn_util.object.has_key(atom_common_properties, k)){
			prop_def = atom_common_properties[k];
		}else if(urn_util.object.has_key(props, k)){
			prop_def = props[k];
		}
		if(!prop_def){
			const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${k}\``;
			throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
		}
		
		const subatom_name = atm_util.get_subatom_name(atom_name, k as string);
		const number_depth = (!depth) ? 0 : depth as number - 1 as schema.Depth;
		try {
			const prop_value = molecule[k];
			if(!depth){
				property(k, prop_def, prop_value, molecule as schema.Atom<A>);
			}else{
				_validate_bond_type(k as keyof schema.Atom<A>, prop_def, prop_value);
				_validate_custom_bond_type(k as keyof schema.Atom<A>, prop_def, prop_value);
				if(Array.isArray(prop_value)){
					for(const subatom of prop_value){
						any(subatom_name, subatom, number_depth);
					}
				}else{
					any<typeof subatom_name, typeof number_depth>(
						subatom_name,
						// prop_value as schema.Molecule<A,D>,
						prop_value as any,
						number_depth
					);
				}
			}
		}catch(e){
			const exc = e as any;
			if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
				throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, molecule, [k]);
			}
			throw exc;
		}
	}
	return true;
}


function _validate_primitive_type<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key: keyof schema.Molecule<A,D>,
	prop_def: Book.Definition.Property,
	prop_value: any
):true{
	if(
		urn_util.object.has_key(prop_def,'optional') &&
		prop_def.optional === true &&
		typeof prop_value === 'undefined'
	){
		return true;
	}
	switch(prop_def.type){
		case BookProperty.ID:
		case BookProperty.TEXT:
		case BookProperty.LONG_TEXT:
		case BookProperty.ENCRYPTED:
		case BookProperty.EMAIL:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.INTEGER:
		case BookProperty.FLOAT:{
			if(typeof prop_value !== 'number'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a number.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.BINARY:{
			if(typeof prop_value !== 'boolean'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a boolean.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.DAY:
		case BookProperty.TIME:{
			// TODO: To be checked if this should be here.
			if(typeof prop_value === 'string'){
				prop_value = new Date(prop_value);
			}
			if(!urn_util.is.date(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a Date.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.SET_STRING:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a string array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.SET_NUMBER:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a number array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.ENUM_STRING:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			if(!prop_def.values.includes(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be one of following:`;
				err_msg += ` ['${prop_def.values.join("','")}']`;
				throw urn_exc.create_invalid_atom('INVALID_ENUM_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.ENUM_NUMBER:{
			if(typeof prop_value !== 'number'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a number.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			if(!prop_def.values.includes(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be one of the following:`;
				err_msg += ` [${prop_def.values.join(', ')}]`;
				throw urn_exc.create_invalid_atom('INVALID_ENUM_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.ATOM:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.ATOM_ARRAY:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be an Array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}else if(!prop_value.every((id) => typeof id === 'string')){
				const err_msg = `Invalid property \`${prop_key}\`. Property should be an Array of string.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
	}
	// const err_msg = `Invalid schema.Atom type definition.`;
	// throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE',err_msg);
}

function _validate_custom_type<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property,
	prop_value:any,
	partial_atom?:Partial<schema.AtomShape<A>>
):void{
	try{
		switch(prop_def.type){
			case BookProperty.TEXT:
			case BookProperty.LONG_TEXT:{
				_custom_validate_string(prop_key, prop_def, prop_value);
				break;
			}
			case BookProperty.INTEGER:
			case BookProperty.FLOAT:{
				_custom_validate_number(prop_key, prop_def, prop_value);
				break;
			}
			case BookProperty.DAY:
			case BookProperty.TIME:{
				_custom_validate_time(prop_key, prop_def, prop_value);
				break;
			}
			case BookProperty.SET_STRING:{
				_custom_validate_set_string(prop_key, prop_def, prop_value);
				break;
			}
			case BookProperty.SET_NUMBER:{
				_custom_validate_set_number(prop_key, prop_def, prop_value);
				break;
			}
		}
	}catch(e){
		const exc = e as any;
		if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
			throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [prop_key]);
		}
		throw exc;
	}
}

function _validate_bond_type<A extends schema.AtomName>(
	prop_key: keyof schema.Atom<A>,
	prop_def: Book.Definition.Property,
	prop_value: any
):true{
	if(
		urn_util.object.has_key(prop_def,'optional') &&
		prop_def.optional === true &&
		typeof prop_value === 'undefined'
	){
		return true;
	}
	switch(prop_def.type){
		case BookProperty.ATOM:{
			if(typeof prop_value === null || typeof prop_value !== 'object'){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be an object.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
		case BookProperty.ATOM_ARRAY:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property \`${prop_key}\`. Property should be an Array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}else if(!prop_value.every((atom) => typeof atom !== null && typeof atom === 'object')){
				const err_msg = `Invalid property \`${prop_key}\`. Property should be an Array of object.`;
				throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
			}
			return true;
		}
	}
	const err_msg = `Invalid schema.Atom type definition.`;
	throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE',err_msg);
}

function _validate_custom_bond_type<A extends schema.AtomName>(
	prop_key:keyof schema.Atom<A>,
	prop_def:Book.Definition.Property,
	prop_value:any,
	partial_atom?:Partial<schema.AtomShape<A>>
):void{
	try{
		switch(prop_def.type){
			case BookProperty.ATOM:{
				_custom_validate_bond_atom(prop_key, prop_def, prop_value);
				break;
			}
			case BookProperty.ATOM_ARRAY:{
				for(const subatom of prop_value){
					_custom_validate_bond_atom(prop_key, prop_def, subatom);
				}
				break;
			}
		}
	}catch(e){
		const exc = e as any;
		if(exc.type === urn_exception.ExceptionType.INVALID_ATOM){
			throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [prop_key]);
		}
		throw exc;
	}
}


function _custom_validate_bond_atom<A extends schema.AtomName, D extends schema.Depth>(
	prop_key:keyof schema.Atom<A>,
	prop_def:Book.Definition.Property.Atom | Book.Definition.Property.AtomArray,
	prop_value:schema.Molecule<A,D>
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.date_from){
			if(prop_value._date < vali.date_from){
				const err_msg = `Invalid \`${prop_key}\`. Creation _date must be after \`${vali.date_from}\`.`;
				throw urn_exc.create_invalid_atom('DATE_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.date_until){
			if(prop_value._date > vali.date_until){
				const err_msg = `Invalid \`${prop_key}\`. Creation _date must be before \`${vali.date_until}\`.`;
				throw urn_exc.create_invalid_atom('DATE_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
			}
		}
	}
	return true;
}

function _custom_validate_string<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property.String,
	prop_value:string
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.alphanum && vali.alphanum === true){
			if(!/[0-9a-zA-Z]/.test(prop_value)){
				const err_msg = `Invalid \`${prop_key}\`. Must be alphanumeric /[0-9a-zA-Z]/.`;
				throw urn_exc.create_invalid_atom('STRING_INVALID_ALPHANUM', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.contain_digit && vali.contain_digit === true){
			if(!/\d/.test(prop_value)){
				const err_msg = `Invalid \`${prop_key}\`. Must contain a digit.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_CONTAIN_DIGIT', err_msg, undefined, [prop_key]);
			}
		}else if(vali.contain_digit === false){
			if(/\d/.test(prop_value)){
				const err_msg = `Invalid \`${prop_key}\`. Must not contain any digit.`;
				throw urn_exc.create_invalid_atom('STRING_CONTAIN_DIGIT', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.contain_lowercase && vali.contain_lowercase === true){
			if(prop_value.toUpperCase() === prop_value){
				const err_msg = `Invalid \`${prop_key}\`. Must contain a lowercase character.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_CONTAIN_LOWERCASE', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.contain_uppercase && vali.contain_uppercase === true){
			if(prop_value.toLowerCase() === prop_value){
				const err_msg = `Invalid \`${prop_key}\`. Must contain an uppercase character.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_CONTAIN_UPPERCASE', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.length){
			if(vali.length !== prop_value.length){
				let err_msg = `Invalid \`${prop_key}\`. String length must be equal to ${vali.length}.`;
				err_msg += ` Length given ${prop_value.length}`;
				throw urn_exc.create_invalid_atom('STRING_INVALI_LENGTH', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.lowercase && vali.lowercase === true){
			if(prop_value.toLowerCase() !== prop_value){
				const err_msg = `Invalid \`${prop_key}\`. Must be lowercase.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_LOWERCASE', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max!){
				const err_msg = `Invalid \`${prop_key}\`. Length must be maximum ${vali.max} characters long.`;
				throw urn_exc.create_invalid_atom('STRING_MAX_LENGTH', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min!){
				const err_msg = `Invalid \`${prop_key}\`. Length must be minimum ${vali.min} characters long.`;
				throw urn_exc.create_invalid_atom('STRING_MIN_LENGTH', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.only_letters && vali.only_letters === true){
			if(!/^[A-Za-z]+$/.test(prop_value)){
				const err_msg = `Invalid \`${prop_key}\`. Must contain only letters.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_ONLY_LETTERS', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.only_numbers){
			if(!/^[0-9]+$/.test(prop_value)){
				const err_msg = `Invalid \`${prop_key}\`. Must contain only numbers.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_ONLY_NUMBERS', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.reg_ex){
			if(!vali.reg_ex!.test(prop_value)){
				const err_msg = `Invalid \`${prop_key}\`. Does not satisfy regular expression ${vali.reg_ex}.`;
				throw urn_exc.create_invalid_atom('STRING_INVALID_REG_EX', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.uppercase && vali.uppercase === true){
			if(prop_value.toUpperCase() !== prop_value){
				const err_msg = `Invalid \`${prop_key}\`. Must be uppercase.`;
				throw urn_exc.create_invalid_atom('STRING_NOT_UPPERCASE', err_msg, undefined, [prop_key]);
			}
		}
	}
	return true;
}

function _custom_validate_number<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property.Number,
	prop_value:number
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			if(prop_value != vali.eq){
				const err_msg = `Invalid \`${prop_key}\`. Must be equal to ${vali.eq}.`;
				throw urn_exc.create_invalid_atom('NUMBER_NOTEQ_TO', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.min){
			if(prop_value < vali.min){
				const err_msg = `Invalid \`${prop_key}\`. Must be grater or equal to ${vali.min}.`;
				throw urn_exc.create_invalid_atom('NUMBER_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.max){
			if(prop_value > vali.max){
				const err_msg = `Invalid \`${prop_key}\`. Must be lower or equal to ${vali.max}.`;
				throw urn_exc.create_invalid_atom('NUMBER_GRATER_THAN_MAX', err_msg, undefined, [prop_key]);
			}
		}
	}
	return true;
}

function _custom_validate_time<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property.DayTime,
	prop_value:Date
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			if(prop_value != vali.eq){
				const err_msg = `Invalid \`${prop_key}\`. Must be equal to ${vali.eq}.`;
				throw urn_exc.create_invalid_atom('DATE_NOT_EQ_TO', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.min){
			if(prop_value < vali.min){
				const err_msg = `Invalid \`${prop_key}\`. Must be grater than ${vali.min}.`;
				throw urn_exc.create_invalid_atom('DATE_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.max){
			if(prop_value > vali.max){
				const err_msg = `Invalid \`${prop_key}\`. Must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid_atom('DATE_GRATER_THAN_MAX', err_msg, undefined, [prop_key]);
			}
		}
	}
	return true;
}

function _custom_validate_set_string<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property.SetString,
	prop_value:string[]
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			if(prop_value.length != vali.length){
				const err_msg = `Invalid \`${prop_key}\`. Array length must be equal to ${vali.length}.`;
				throw urn_exc.create_invalid_atom('SET_LENGTH_NOT_EQ_TO', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min){
				const err_msg = `Invalid \`${prop_key}\`. Array length must be greater than ${vali.min}.`;
				throw urn_exc.create_invalid_atom('SET_LENGTH_LOWER_THAN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max){
				const err_msg = `Invalid \`${prop_key}\`. Array length must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.values){
			for(const v of prop_value){
				if(!vali.values.includes(v)){
					let err_msg = `Invalid \`${prop_key}\`. Invalid element. Element must be one of the following:`;
					err_msg += ` ['${vali.values.join("', '")}']`;
					throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
				}
			}
		}
	}
	return true;
}

function _custom_validate_set_number<A extends schema.AtomName, D extends schema.Depth = 0>(
	prop_key:keyof schema.Molecule<A,D>,
	prop_def:Book.Definition.Property.SetNumber,
	prop_value:number[]
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			if(prop_value.length != vali.length){
				const err_msg = `Invalid \`${prop_key}\`. Array length must be equal to ${vali.length}.`;
				throw urn_exc.create_invalid_atom('SET_LENGTH_NOT_EQ_TO', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min){
				const err_msg = `Invalid \`${prop_key}\`. Array length must be greater than ${vali.min}.`;
				throw urn_exc.create_invalid_atom('SET_LENGTH_LOWER_THAN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max){
				const err_msg = `Invalid \`${prop_key}\`. Array length must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
			}
		}
		if(vali.values){
			for(const v of prop_value){
				if(!vali.values.includes(v)){
					let err_msg = `Invalid \`${prop_key}\`. Invalid element. Element must be one of the following:`;
					err_msg += ` [${vali.values.join(', ')}]`;
					throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
				}
			}
		}
	}
	return true;
}
