/**
 * Module for Atom Validation
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init(`ATOM_VALIDATE`, `Atom validate module`);

import {
	atom_hard_properties,
	atom_common_properties,
	AtomName,
	Atom,
	AtomShape,
	Book,
	BookPropertyType,
	Depth,
	Molecule
} from '../types';

import {atom_book} from '../book';

import {core_config} from '../config/defaults';

import {is_atom, get_subatom_name} from './util';


export function validate_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:true{
	_validate_hard_properties(molecule);
	_validate_molecule_shape(atom_name, molecule);
	return true;
}

function _validate_molecule_shape<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:true{
	_has_no_other_properties(atom_name, molecule as Partial<AtomShape<A>>);
	_primitive_properties_have_correct_type(atom_name, molecule as any);
	_subatom_properties_have_correct_type(atom_name, molecule);
	return true;
}

export function validate_atom<A extends AtomName>(atom_name:A, atom:Atom<A>)
		:true{
	_validate_hard_properties(atom);
	validate_atom_shape(atom_name, atom);
	return true;
}

export function validate_atom_shape<A extends AtomName>(atom_name:A, atom_shape:AtomShape<A>)
		:true{
	_has_all_properties(atom_name, atom_shape);
	validate_atom_partial(atom_name, atom_shape);
	return true;
}

export function validate_atom_partial<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	_has_no_other_properties(atom_name, partial_atom);
	_atom_properties_have_correct_type(atom_name, partial_atom);
	_custom_atom_validation(atom_name, partial_atom);
	return true;
}


function _custom_atom_validation<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	const atom_props = atom_book[atom_name]['properties'];
	const all_props = {
		...atom_hard_properties,
		...atom_common_properties,
		...atom_props
	};
	for(const [k,v] of Object.entries(all_props)){
		try{
			switch(v.type){
				case BookPropertyType.TEXT:
				case BookPropertyType.LONG_TEXT:{
					_validate_atom_string(k, (partial_atom as any)[k], v);
					break;
				}
				case BookPropertyType.INTEGER:
				case BookPropertyType.FLOAT:{
					_validate_atom_number(k, (partial_atom as any)[k], v);
					break;
				}
				case BookPropertyType.TIME:{
					_validate_atom_time(k, (partial_atom as any)[k], v);
					break;
				}
				case BookPropertyType.SET_STRING:{
					_validate_atom_set_string(k, (partial_atom as any)[k], v);
					break;
				}
				case BookPropertyType.SET_NUMBER:{
					_validate_atom_set_number(k, (partial_atom as any)[k], v);
					break;
				}
			}
		}catch(exc){
			if(exc.type === urn_exception.ExceptionType.INVALID){
				throw urn_exc.create_invalid(exc.code, exc.msg, partial_atom, [k], exc);
			}
			throw exc;
		}
	}
	return true;
}

export function is_valid_key<A extends AtomName>(atom_name:A, key:string)
		:boolean{
	return (urn_util.object.has_key(atom_book[atom_name]['properties'], key));
}

export function fix_atom_key<A extends AtomName>(
	atom_name:A,
	atom:Atom<A>,
	key:string
):Atom<A>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	if(atom_props[key] && atom_props[key].on_error && typeof atom_props[key].on_error === 'function'){
		(atom as any)[key] = atom_props[key].on_error!((atom as any)[key]);
	}else if(atom_props[key] && atom_props[key].default){
		(atom as any)[key] = atom_props[key].default;
	}else{
		let err_msg = `Cannot fix property of Atom. Missing 'on_error' function in atom_book`;
		err_msg += ` for Atom [${atom_name}] property [${key}]`;
		throw urn_exc.create('CANNOT_FIX', err_msg);
	}
	return atom;
}

export function _validate_encrypt_property(
	prop_key: string,
	prop_value:string,
	prop_def:Book.Definition.Property.Encrypted
):true{
	if(prop_def && prop_def.validation && prop_def.validation.max &&
		prop_def.validation.max > core_config.max_password_length){
		prop_def.validation.max = core_config.max_password_length;
	}
	_validate_atom_string(prop_key, prop_value, prop_def);
	return true;
}

function _validate_atom_string(
	prop_key:string,
	prop_value:string,
	prop_def:Book.Definition.Property.String
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.alphanum && vali.alphanum === true){
			if(!/[0-9a-zA-Z]/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be alphanumeric /[0-9a-zA-Z]/.`;
				throw urn_exc.create_invalid('STRING_INVALID_ALPHANUM', err_msg);
			}
		}
		if(vali.contain_digit && vali.contain_digit === true){
			if(!/\d/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be contain a digit.`;
				throw urn_exc.create_invalid('STRING_NOT_CONTAIN_DIGIT', err_msg);
			}
		}
		if(vali.contain_lowercase && vali.contain_lowercase === true){
			if(prop_value.toUpperCase() === prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be contain a lowercase character.`;
				throw urn_exc.create_invalid('STRING_NOT_CONTAIN_LOWERCASE', err_msg);
			}
		}
		if(vali.contain_uppercase && vali.contain_uppercase === true){
			if(prop_value.toLowerCase() === prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be contain an uppercase character.`;
				throw urn_exc.create_invalid('STRING_NOT_CONTAIN_UPPERCASE', err_msg);
			}
		}
		if(vali.length){
			if(vali.length !== prop_value.length){
				let err_msg = `Invalid [${prop_key}]. String length must be equal to ${vali.length}.`;
				err_msg += ` Length given ${prop_value.length}`;
				throw urn_exc.create_invalid('STRING_INVALI_LENGTH', err_msg);
			}
		}
		if(vali.lowercase && vali.lowercase === true){
			if(prop_value.toLowerCase() !== prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be lowercase.`;
				throw urn_exc.create_invalid('STRING_NOT_LOWERCASE', err_msg);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max!){
				const err_msg = `Invalid [${prop_key}]. Length must be maximum ${vali.max} characters long.`;
				throw urn_exc.create_invalid('STRING_MAX_LENGTH', err_msg);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min!){
				const err_msg = `Invalid [${prop_key}]. Length must be minimum ${vali.min} characters long.`;
				throw urn_exc.create_invalid('STRING_MIN_LENGTH', err_msg);
			}
		}
		if(vali.only_letters && vali.only_letters === true){
			if(!/^[A-Za-z]+$/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be contain only letters.`;
				throw urn_exc.create_invalid('STRING_NOT_ONLY_LETTERS', err_msg);
			}
		}
		if(vali.only_numbers){
			if(!/^[0-9]+$/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be contain only numbers.`;
				throw urn_exc.create_invalid('STRING_NOT_ONLY_NUMBERS', err_msg);
			}
		}
		if(vali.reg_ex){
			if(!vali.reg_ex!.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Does not satisfy regular expression ${vali.reg_ex}.`;
				throw urn_exc.create_invalid('STRING_INVALID_REG_EX', err_msg);
			}
		}
		if(vali.uppercase && vali.uppercase === true){
			if(prop_value.toUpperCase() !== prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be uppercase.`;
				throw urn_exc.create_invalid('STRING_NOT_UPPERCASE', err_msg);
			}
		}
	}
	return true;
}

function _validate_atom_number(
	prop_key:string,
	prop_value:number,
	prop_def:Book.Definition.Property.Number
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			if(prop_value != vali.eq){
				const err_msg = `Invalid [${prop_key}]. Must be equal to ${vali.eq}.`;
				throw urn_exc.create_invalid('NUMBER_NOTEQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value < vali.min){
				const err_msg = `Invalid [${prop_key}]. Must be grater than ${vali.min}.`;
				throw urn_exc.create_invalid('NUMBER_LOWER_THAN_MIN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value > vali.max){
				const err_msg = `Invalid [${prop_key}]. Must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid('NUMBER_GRATER_THAN_MAX', err_msg);
			}
		}
	}
	return true;
}

function _validate_atom_time(
	prop_key:string,
	prop_value:Date,
	prop_def:Book.Definition.Property.Time
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			if(prop_value != vali.eq){
				const err_msg = `Invalid [${prop_key}]. Must be equal to ${vali.eq}.`;
				throw urn_exc.create_invalid('DATE_NOT_EQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value < vali.min){
				const err_msg = `Invalid [${prop_key}]. Must be grater than ${vali.min}.`;
				throw urn_exc.create_invalid('DATE_LOWER_THAN_MIN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value > vali.max){
				const err_msg = `Invalid [${prop_key}]. Must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid('DATE_GRATER_THAN_MAX', err_msg);
			}
		}
	}
	return true;
}

// function _validate_atom_enum_string(prop_key:string, prop_value:string, prop_def:AtomPropertyEnumString)
//     :true{
//   if(prop_def.values && !prop_def.values.includes(prop_value)){
//     let err_msg = `Invalid [${prop_key}]. Must be one of the following`;
//     err_msg += ` [${prop_def.values.join(',')}]`;
//     throw urn_exc.create_invalid('ENUM_INVALID', err_msg);
//   }
//   return true;
// }

// function _validate_atom_enum_number(prop_key:string, prop_value:number, prop_def:AtomPropertyEnumNumber)
//     :true{
//   if(prop_def.values && !prop_def.values.includes(prop_value)){
//     let err_msg = `Invalid [${prop_key}]. Must be one of the following`;
//     err_msg += ` [${prop_def.values.join(',')}]`;
//     throw urn_exc.create_invalid('ENUM_INVALID', err_msg);
//   }
//   return true;
// }

function _validate_atom_set_string(
	prop_key: string,
	prop_value: string[],
	prop_def: Book.Definition.Property.SetString
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			if(prop_value.length != vali.length){
				const err_msg = `Invalid [${prop_key}]. Array length must be equal to ${vali.length}.`;
				throw urn_exc.create_invalid('SET_LENGTH_NOT_EQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min){
				const err_msg = `Invalid [${prop_key}]. Array length must be greater than ${vali.min}.`;
				throw urn_exc.create_invalid('SET_LENGTH_LOWER_THAN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max){
				const err_msg = `Invalid [${prop_key}]. Array length must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
			}
		}
		if(vali.values){
			for(const v of prop_value){
				if(!vali.values.includes(v)){
					let err_msg = `Invalid [${prop_key}]. Invalid element. Element must be one of the following:`;
					err_msg += ` ['${vali.values.join("', '")}']`;
					throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
				}
			}
		}
	}
	return true;
}

function _validate_atom_set_number(
	prop_key:string,
	prop_value:number[],
	prop_def:Book.Definition.Property.SetNumber
):true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			if(prop_value.length != vali.length){
				const err_msg = `Invalid [${prop_key}]. Array length must be equal to ${vali.length}.`;
				throw urn_exc.create_invalid('SET_LENGTH_NOT_EQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min){
				const err_msg = `Invalid [${prop_key}]. Array length must be greater than ${vali.min}.`;
				throw urn_exc.create_invalid('SET_LENGTH_LOWER_THAN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max){
				const err_msg = `Invalid [${prop_key}]. Array length must be lower than ${vali.max}.`;
				throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
			}
		}
		if(vali.values){
			for(const v of prop_value){
				if(!vali.values.includes(v)){
					let err_msg = `Invalid [${prop_key}]. Invalid element. Element must be one of the following:`;
					err_msg += ` [${vali.values.join(', ')}]`;
					throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
				}
			}
		}
	}
	return true;
}

function _is_optional_property(prop:Book.Definition.Property)
		:boolean{
	return (urn_util.object.has_key(prop, 'optional') && prop.optional === true);
}

function _validate_hard_properties<A extends AtomName>(atom:Atom<A>)
		:true{
	let k: keyof typeof atom_hard_properties;
	for(k in atom_hard_properties){
		try{
			_check_prop_main_type(atom_hard_properties[k], k, atom[k]);
		}catch(exc){
			if(exc.type === urn_exception.ExceptionType.INVALID){
				throw urn_exc.create_invalid(exc.code, exc.msg, atom, [k], exc);
			}
			throw exc;
		}
	}
	return true;
}

function _has_all_properties<A extends AtomName>(atom_name:A, atom_shape:AtomShape<A>)
		:true{
	const atom_props = atom_book[atom_name]['properties'];
	const missin_props:string[] = [];
	for(const [k,v] of Object.entries(atom_props)){
		if(!_is_optional_property(v) && !urn_util.object.has_key(atom_shape,k)){
			missin_props.push(k);
		}
	}
	for(const [k,v] of Object.entries(atom_common_properties)){
		if(!_is_optional_property(v) && !urn_util.object.has_key(atom_shape,k)){
			missin_props.push(k);
		}
	}
	if(missin_props.length > 0){
		let err_msg = `Atom is missing the following properties:`;
		err_msg += ` [${missin_props.join(', ')}]`;
		throw urn_exc.create_invalid('MISSING_PROP', err_msg, atom_shape, missin_props);
	}
	return true;
}

function _has_no_other_properties<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	const atom_props = atom_book[atom_name]['properties'];
	const extra_props:string[] = [];
	for(const k in partial_atom){
		if(urn_util.object.has_key(atom_hard_properties,k)){
			continue;
		}
		if(urn_util.object.has_key(atom_common_properties,k)){
			continue;
		}
		if(!urn_util.object.has_key(atom_props,k)){
			extra_props.push(k);
		}
	}
	if(extra_props.length > 0){
		let err_msg = `Atom has invalid properties:`;
		err_msg += ` [${extra_props.join(', ')}]`;
		throw urn_exc.create_invalid('INVALID_EXTRA_PROP', err_msg, partial_atom, extra_props);
	}
	return true;
}

function _primitive_properties_have_correct_type<A extends AtomName, D extends Depth>(
	atom_name:A,
	molecule:Molecule<A,D>
):true{
	const props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let k:keyof typeof molecule;
	for(k in molecule){
		let prop_def = undefined;
		if(urn_util.object.has_key(atom_hard_properties, k)){
			prop_def = atom_hard_properties[k];
		}else if(urn_util.object.has_key(atom_common_properties, k)){
			prop_def = atom_common_properties[k];
		}else if(urn_util.object.has_key(props, k)){
			prop_def = props[k];
		}
		if(!prop_def){
			const err_msg = `Atom property definition missing for atom [${atom_name}] property [${k}]`;
			throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
		}
		
		if(prop_def.type === BookPropertyType.ATOM || prop_def.type === BookPropertyType.ATOM_ARRAY){
			return true;
		}
		
		try{
			_check_prop_main_type(prop_def, k as string, molecule[k]);
		}catch(exc){
			if(exc.type === urn_exception.ExceptionType.INVALID){
				throw urn_exc.create_invalid(exc.code, exc.msg, molecule, [k], exc);
			}
			throw exc;
		}
	}
	return true;
}

function _subatom_properties_have_correct_type<A extends AtomName, D extends Depth>(
	atom_name:A,
	molecule:Molecule<A,D>
):true{
	const props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let k:keyof typeof molecule;
	for(k in molecule){
		let prop_def = undefined;
		if(urn_util.object.has_key(atom_hard_properties, k)){
			prop_def = atom_hard_properties[k];
		}else if(urn_util.object.has_key(atom_common_properties, k)){
			prop_def = atom_common_properties[k];
		}else if(urn_util.object.has_key(props, k)){
			prop_def = props[k];
		}
		if(!prop_def){
			const err_msg = `Atom property definition missing for atom [${atom_name}] property [${k}]`;
			throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
		}
		
		if(prop_def.type !== BookPropertyType.ATOM && prop_def.type !== BookPropertyType.ATOM_ARRAY){
			return true;
		}
		
		const subatom_name = get_subatom_name(atom_name, k as string);
		
		try{
			_check_prop_subtype(subatom_name, molecule[k]);
		}catch(exc){
			if(exc.type === urn_exception.ExceptionType.INVALID){
				throw urn_exc.create_invalid(exc.code, exc.msg, molecule, [k], exc);
			}
			throw exc;
		}
	}
	return true;
}

function _atom_properties_have_correct_type<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	const props = atom_book[atom_name]['properties'];
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
			const err_msg = `Atom property definition missing for atom [${atom_name}] property [${k}]`;
			throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
		}
		try{
			_check_prop_main_type(prop_def, k as string, partial_atom[k]);
		}catch(exc){
			if(exc.type === urn_exception.ExceptionType.INVALID){
				throw urn_exc.create_invalid(exc.code, exc.msg, partial_atom, [k], exc);
			}
			throw exc;
		}
	}
	return true;
}

function _check_prop_subtype<A extends AtomName>(
	subatom_name:A,
	subatom: any
):true{
	if(is_atom(subatom_name, subatom)){
		validate_atom(subatom_name, subatom);
	}else{
		validate_molecule(subatom_name, subatom);
	}
	return true;
}

function _check_prop_main_type(prop_def: Book.Definition.Property, prop_key: string, prop_value: any)
		:true{
	if(urn_util.object.has_key(prop_def,'optional') &&
		prop_def.optional === true &&
		typeof prop_value === 'undefined'
	){
		return true;
	}
	switch(prop_def.type){
		case BookPropertyType.ID:
		case BookPropertyType.TEXT:
		case BookPropertyType.LONG_TEXT:
		case BookPropertyType.ENCRYPTED:
		case BookPropertyType.EMAIL:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.INTEGER:
		case BookPropertyType.FLOAT:{
			if(typeof prop_value !== 'number'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a number.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.BINARY:{
			if(typeof prop_value !== 'boolean'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a boolean.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.TIME:{
			if(!urn_util.is.date(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a Date.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.SET_STRING:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.SET_NUMBER:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a number array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.ENUM_STRING:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			if(!prop_def.values.includes(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be one of following:`;
				err_msg += ` ['${prop_def.values.join("','")}']`;
				throw urn_exc.create_invalid('INVALID_ENUM_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.ENUM_NUMBER:{
			if(typeof prop_value !== 'number'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a number.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			if(!prop_def.values.includes(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be one of the following:`;
				err_msg += ` [${prop_def.values.join(', ')}]`;
				throw urn_exc.create_invalid('INVALID_ENUM_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.ATOM_ARRAY:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be an Array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}else if(!prop_value.every((id) => typeof id === 'string')){
				const err_msg = `Invalid property [${prop_key}]. Property should be an Array of string.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
		case BookPropertyType.ATOM:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create_invalid('INVALID_PROP', err_msg);
			}
			return true;
		}
	}
	// const err_msg = `Invalid Atom type definition.`;
	// throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE',err_msg);
}

