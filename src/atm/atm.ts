/**
 *
 * Module for Atom
 *
 * @packageDocumentation
 */

import bcrypt from 'bcrypt';

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init(`ATM`, `Atom module`);

import {
	atom_hard_properties,
	atom_common_properties,
	AtomName,
	KeyOfAtom,
	KeyOfAtomShape,
	AtomPropertiesDefinition,
	AtomPropertyDefinition,
	AtomPropertyEncrypted,
	AtomPropertyString,
	AtomPropertyNumber,
	// AtomPropertyEnumString,
	// AtomPropertyEnumNumber,
	AtomPropertyTime,
	AtomPropertySetString,
	AtomPropertySetNumber,
	Atom,
	AtomShape,
	AtomPropertyType,
} from '../types';

import {atom_book} from '../book';

import {core_config} from '../config/defaults';

export async function encrypt_property<A extends AtomName>
(atom_name:A, prop_key:KeyOfAtomShape<A>, prop_value:string)
		:Promise<string>{
	const atom_props = atom_book[atom_name]['properties'];
	_validate_encrypt_property(prop_key as string, prop_value, (atom_props as any)[prop_key]);
	// *********
	// IMPORTANT - If the encryption method is changed,
	// *********   DAL._encrypt_changed_properties must be changed too.
	// *********
	const salt = await bcrypt.genSalt(core_config.encryption_round);
	return await bcrypt.hash(prop_value, salt);
}

export async function encrypt_properties<A extends AtomName>(atom_name:A, atom:AtomShape<A>):Promise<AtomShape<A>>
export async function encrypt_properties<A extends AtomName>(atom_name:A, atom:Partial<AtomShape<A>>)
		:Promise<Partial<AtomShape<A>>>{
	const atom_props = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	let k:KeyOfAtomShape<A>;
	for(k in atom){
		if(
			urn_util.object.has_key(atom_props, k) &&
			atom_props[k] &&
			atom_props[k].type === AtomPropertyType.ENCRYPTED
		){
			atom[k] = await encrypt_property<A>(atom_name, k, atom[k] as string) as any;
		}
	}
	return atom;
}

export function get_encrypted_keys<A extends AtomName>(atom_name:A)
		:Set<KeyOfAtom<A>>{
	const encrypt_keys = new Set<KeyOfAtom<A>>();
	const atom_props = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	for(const k in atom_props){
		const prop:AtomPropertyDefinition = atom_props[k];
		if(urn_util.object.has_key(prop, 'type') && prop.type === AtomPropertyType.ENCRYPTED){
			encrypt_keys.add(k as KeyOfAtom<A>);
		}
	}
	return encrypt_keys;
}

export function get_unique_keys<A extends AtomName>(atom_name:A)
		:Set<KeyOfAtomShape<A>>{
	const unique_keys = new Set<KeyOfAtomShape<A>>();
	const atom_props = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	for(const k in atom_props){
		const prop:AtomPropertyDefinition = atom_props[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as KeyOfAtomShape<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:AtomPropertyDefinition = atom_common_properties[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as KeyOfAtomShape<A>);
		}
	}
	return unique_keys;
}

export function validate<A extends AtomName>(atom_name:A, atom:Atom<A>)
		:true{
	_validate_hard_properties(atom);
	validate_shape<A>(atom_name, atom);
	return true;
}

export function validate_shape<A extends AtomName>(atom_name:A, atom_shape:AtomShape<A>)
		:true{
	_has_all_properties<A>(atom_name, atom_shape);
	validate_partial<A>(atom_name, atom_shape);
	return true;
}

export function validate_partial<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	_has_no_other_properties(atom_name, partial_atom);
	_properties_have_correct_type(atom_name, partial_atom);
	_custom_validation(atom_name, partial_atom);
	return true;
}

function _custom_validation<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	const atom_props = atom_book[atom_name]['properties'];
	const all_props = {
		...atom_hard_properties,
		...atom_common_properties,
		...atom_props
	};
	for(const [k,v] of Object.entries(all_props)){
		switch(v.type){
			case AtomPropertyType.TEXT:
			case AtomPropertyType.LONG_TEXT:{
				_validate_atom_string(k, (partial_atom as any)[k], v);
				break;
			}
			case AtomPropertyType.INTEGER:
			case AtomPropertyType.FLOAT:{
				_validate_atom_number(k, (partial_atom as any)[k], v);
				break;
			}
			case AtomPropertyType.TIME:{
				_validate_atom_time(k, (partial_atom as any)[k], v);
				break;
			}
			// case AtomPropertyType.ENUM_STRING:{
			//   _validate_atom_enum_string(k, (partial_atom as any)[k], v);
			//   break;
			// }
			// case AtomPropertyType.ENUM_NUMBER:{
			//   _validate_atom_enum_number(k, (partial_atom as any)[k], v);
			//   break;
			// }
			case AtomPropertyType.SET_STRING:{
				_validate_atom_set_string(k, (partial_atom as any)[k], v);
				break;
			}
			case AtomPropertyType.SET_NUMBER:{
				_validate_atom_set_number(k, (partial_atom as any)[k], v);
				break;
			}
		}
	}
	return true;
}

function _validate_encrypt_property(prop_key: string, prop_value:string, prop_def:AtomPropertyEncrypted)
		:true{
	if(prop_def && prop_def.validation && prop_def.validation.max &&
		prop_def.validation.max > core_config.max_password_length){
		prop_def.validation.max = core_config.max_password_length;
	}
	_validate_atom_string(prop_key, prop_value, prop_def);
	return true;
}

function _validate_atom_string(prop_key:string, prop_value:string, prop_def:AtomPropertyString)
		:true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.alphanum && vali.alphanum === true){
			if(!/[0-9a-zA-Z]/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be alphanumeric /[0-9a-zA-Z]/.`;
				throw urn_exc.create('VALIDATE_STRING_INVALID_ALPHANUM', err_msg);
			}
		}
		if(vali.contain_digit && vali.contain_digit === true){
			if(!/\d/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be contain a digit.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_CONTAIN_DIGIT', err_msg);
			}
		}
		if(vali.contain_lowercase && vali.contain_lowercase === true){
			if(prop_value.toUpperCase() === prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be contain a lowercase character.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_CONTAIN_LOWERCASE', err_msg);
			}
		}
		if(vali.contain_uppercase && vali.contain_uppercase === true){
			if(prop_value.toLowerCase() === prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be contain an uppercase character.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_CONTAIN_UPPERCASE', err_msg);
			}
		}
		if(vali.length){
			if(vali.length !== prop_value.length){
				let err_msg = `Invalid [${prop_key}]. String length must be equal to ${vali.length}.`;
				err_msg += ` Length given ${prop_value.length}`;
				throw urn_exc.create('VALIDATE_STRING_INVALI_LENGTH', err_msg);
			}
		}
		if(vali.lowercase && vali.lowercase === true){
			if(prop_value.toLowerCase() !== prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be lowercase.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_LOWERCASE', err_msg);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max!){
				const err_msg = `Invalid [${prop_key}]. Length must be maximum ${vali.max} characters long.`;
				throw urn_exc.create('VALIDATE_STRING_MAX_LENGTH', err_msg);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min!){
				const err_msg = `Invalid [${prop_key}]. Length must be minimum ${vali.min} characters long.`;
				throw urn_exc.create('VALIDATE_STRING_MIN_LENGTH', err_msg);
			}
		}
		if(vali.only_letters && vali.only_letters === true){
			if(!/^[A-Za-z]+$/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be contain only letters.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_ONLY_LETTERS', err_msg);
			}
		}
		if(vali.only_numbers){
			if(!/^[0-9]+$/.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Must be contain only numbers.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_ONLY_NUMBERS', err_msg);
			}
		}
		if(vali.reg_ex){
			if(!vali.reg_ex!.test(prop_value)){
				const err_msg = `Invalid [${prop_key}]. Does not satisfy regular expression ${vali.reg_ex}.`;
				throw urn_exc.create('VALIDATE_STRING_INVALID_REG_EX', err_msg);
			}
		}
		if(vali.uppercase && vali.uppercase === true){
			if(prop_value.toUpperCase() !== prop_value){
				const err_msg = `Invalid [${prop_key}]. Must be uppercase.`;
				throw urn_exc.create('VALIDATE_STRING_NOT_UPPERCASE', err_msg);
			}
		}
	}
	return true;
}

function _validate_atom_number(prop_key:string, prop_value:number, prop_def:AtomPropertyNumber)
		:true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			if(prop_value != vali.eq){
				const err_msg = `Invalid [${prop_key}]. Must be equal to ${vali.eq}.`;
				throw urn_exc.create('VALIDATE_NUMBER_NOTEQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value < vali.min){
				const err_msg = `Invalid [${prop_key}]. Must be grater than ${vali.min}.`;
				throw urn_exc.create('VALIDATE_NUMBER_LOWER_THAN_MIN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value > vali.max){
				const err_msg = `Invalid [${prop_key}]. Must be lower than ${vali.max}.`;
				throw urn_exc.create('VALIDATE_NUMBER_GRATER_THAN_MAX', err_msg);
			}
		}
	}
	return true;
}

function _validate_atom_time(prop_key:string, prop_value:Date, prop_def:AtomPropertyTime)
		:true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			if(prop_value != vali.eq){
				const err_msg = `Invalid [${prop_key}]. Must be equal to ${vali.eq}.`;
				throw urn_exc.create('VALIDATE_DATE_NOT_EQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value < vali.min){
				const err_msg = `Invalid [${prop_key}]. Must be grater than ${vali.min}.`;
				throw urn_exc.create('VALIDATE_DATE_LOWER_THAN_MIN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value > vali.max){
				const err_msg = `Invalid [${prop_key}]. Must be lower than ${vali.max}.`;
				throw urn_exc.create('VALIDATE_DATE_GRATER_THAN_MAX', err_msg);
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
//     throw urn_exc.create('VALIDATE_ENUM_INVALID', err_msg);
//   }
//   return true;
// }

// function _validate_atom_enum_number(prop_key:string, prop_value:number, prop_def:AtomPropertyEnumNumber)
//     :true{
//   if(prop_def.values && !prop_def.values.includes(prop_value)){
//     let err_msg = `Invalid [${prop_key}]. Must be one of the following`;
//     err_msg += ` [${prop_def.values.join(',')}]`;
//     throw urn_exc.create('VALIDATE_ENUM_INVALID', err_msg);
//   }
//   return true;
// }

function _validate_atom_set_string(prop_key:string, prop_value:string[], prop_def:AtomPropertySetString)
		:true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			if(prop_value.length != vali.length){
				const err_msg = `Invalid [${prop_key}]. Array length must be equal to ${vali.length}.`;
				throw urn_exc.create('VALIDATE_SET_LENGTH_NOT_EQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min){
				const err_msg = `Invalid [${prop_key}]. Array length must be greater than ${vali.min}.`;
				throw urn_exc.create('VALIDATE_SET_LENGTH_LOWER_THAN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max){
				const err_msg = `Invalid [${prop_key}]. Array length must be lower than ${vali.max}.`;
				throw urn_exc.create('VALIDATE_SET_LENGTH_GRATER_THAN', err_msg);
			}
		}
		if(vali.values){
			for(const v of prop_value){
				if(!vali.values.includes(v)){
					let err_msg = `Invalid [${prop_key}]. Invalid element. Element must be one of the following:`;
					err_msg += ` ['${vali.values.join("', '")}']`;
					throw urn_exc.create('VALIDATE_SET_LENGTH_GRATER_THAN', err_msg);
				}
			}
		}
	}
	return true;
}

function _validate_atom_set_number(prop_key:string, prop_value:number[], prop_def:AtomPropertySetNumber)
		:true{
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			if(prop_value.length != vali.length){
				const err_msg = `Invalid [${prop_key}]. Array length must be equal to ${vali.length}.`;
				throw urn_exc.create('VALIDATE_SET_LENGTH_NOT_EQ_TO', err_msg);
			}
		}
		if(vali.min){
			if(prop_value.length < vali.min){
				const err_msg = `Invalid [${prop_key}]. Array length must be greater than ${vali.min}.`;
				throw urn_exc.create('VALIDATE_SET_LENGTH_LOWER_THAN', err_msg);
			}
		}
		if(vali.max){
			if(prop_value.length > vali.max){
				const err_msg = `Invalid [${prop_key}]. Array length must be lower than ${vali.max}.`;
				throw urn_exc.create('VALIDATE_SET_LENGTH_GRATER_THAN', err_msg);
			}
		}
		if(vali.values){
			for(const v of prop_value){
				if(!vali.values.includes(v)){
					let err_msg = `Invalid [${prop_key}]. Invalid element. Element must be one of the following:`;
					err_msg += ` [${vali.values.join(', ')}]`;
					throw urn_exc.create('VALIDATE_SET_LENGTH_GRATER_THAN', err_msg);
				}
			}
		}
	}
	return true;
}

function _is_optional_property(prop:AtomPropertyDefinition)
		:boolean{
	return (urn_util.object.has_key(prop, 'optional') && prop.optional === true);
}

function _validate_hard_properties<A extends AtomName>(atom:Atom<A>)
		:true{
	let k: keyof typeof atom_hard_properties;
	for(k in atom_hard_properties){
		_check_prop_main_type(atom_hard_properties[k], k, atom[k]);
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
		throw urn_exc.create('VALIDATE_MISSING_PROP', err_msg);
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
		throw urn_exc.create('VALIDATE_INVALID_PROP', err_msg);
	}
	return true;
}

function _properties_have_correct_type<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
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
		_check_prop_main_type(prop_def, k as string, partial_atom[k]);
	}
	return true;
}

function _check_prop_main_type(prop_def: AtomPropertyDefinition, prop_key: string, prop_value: any)
		:true{
	if(urn_util.object.has_key(prop_def,'optional') &&
		prop_def.optional === true &&
		typeof prop_value === 'undefined'
	){
		return true;
	}
	switch(prop_def.type){
		case AtomPropertyType.ID:
		case AtomPropertyType.TEXT:
		case AtomPropertyType.LONG_TEXT:
		case AtomPropertyType.ENCRYPTED:
		case AtomPropertyType.EMAIL:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.INTEGER:
		case AtomPropertyType.FLOAT:{
			if(typeof prop_value !== 'number'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a number.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.BINARY:{
			if(typeof prop_value !== 'boolean'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a boolean.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.TIME:{
			if(!urn_util.is.date(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a Date.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.SET_STRING:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.SET_NUMBER:{
			if(!Array.isArray(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a number array.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.ENUM_STRING:{
			if(typeof prop_value !== 'string'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			if(!prop_def.values.includes(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a one of following:`;
				err_msg += ` ['${prop_def.values.join("','")}']`;
				throw urn_exc.create('INVALID_ENUM_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.ENUM_NUMBER:{
			if(typeof prop_value !== 'number'){
				let err_msg = `Invalid property [${prop_key}]. Property should be a number.`;
				err_msg += ` Type ${typeof prop_value} given.`;
				throw urn_exc.create('INVALID_PROP', err_msg);
			}
			if(!prop_def.values.includes(prop_value)){
				let err_msg = `Invalid property [${prop_key}]. Property should be a one of the following:`;
				err_msg += ` [${prop_def.values.join(', ')}]`;
				throw urn_exc.create('INVALID_ENUM_PROP', err_msg);
			}
			return true;
		}
		case AtomPropertyType.ATOM:{
			return true;
		}
	}
	// const err_msg = `Invalid Atom type definition.`;
	// throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE',err_msg);
}


