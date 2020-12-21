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
	AtomPropertiesDefinition,
	AtomPropertyDefinition,
	AtomPropertyEncrypted,
	AtomPropertyString,
	Atom,
	AtomShape,
	AtomPropertyType
} from '../types';

import {atom_book} from '../book';

export async function encrypt_properties<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:Promise<Partial<AtomShape<A>>>{
	const atom_props = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	for(const k in partial_atom){
		if(urn_util.object.has_key(atom_props, k) && atom_props[k].type === AtomPropertyType.ENCRYPTED){
			_validate_encrypt_property((partial_atom as any)[k], atom_props[k] as AtomPropertyEncrypted);
			const salt = await bcrypt.genSalt(12);
			(partial_atom as any)[k] = await bcrypt.hash((partial_atom as any)[k], salt);
		}
	}
	return partial_atom;
}

export function get_unique_keys<A extends AtomName>(atom_name:A)
		:Set<KeyOfAtom<A>>{
	const unique_keys = new Set<KeyOfAtom<A>>();
	const atom_properties = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	for(const k in atom_properties){
		const prop:AtomPropertyDefinition = atom_properties[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as KeyOfAtom<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:AtomPropertyDefinition = atom_common_properties[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as KeyOfAtom<A>);
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
	// vim ts compiler was giving an error AtomShape is not compatibile with Partial<AtomShape>>
	validate_partial<A>(atom_name, atom_shape as Partial<AtomShape<A>>);
	return true;
}

export function validate_partial<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	_has_no_other_properties(atom_name, partial_atom);
	_properties_have_correct_type(atom_name, partial_atom);
	return true;
}

function _validate_encrypt_property(prop_value:string, prop_def:AtomPropertyEncrypted)
		:true{
	if(urn_util.object.has_key(prop_def, 'validation')){
		_validate_atom_string(prop_value, prop_def);
	}
	return true;
}

function _validate_atom_string(prop_value:string, prop_def:AtomPropertyString)
		:true{
	//TODO
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
	const atom_properties = atom_book[atom_name]['properties'];
	const missin_props:string[] = [];
	for(const [k,v] of Object.entries(atom_properties)){
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
	const atom_properties = atom_book[atom_name]['properties'];
	const extra_props:string[] = [];
	for(const k in partial_atom){
		if(urn_util.object.has_key(atom_hard_properties,k)){
			continue;
		}
		if(urn_util.object.has_key(atom_common_properties,k)){
			continue;
		}
		if(!urn_util.object.has_key(atom_properties,k)){
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
				let err_msg = `Invalid property [${prop_key}]. Property should be a one of these`;
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
				let err_msg = `Invalid property [${prop_key}]. Property should be a one of these`;
				err_msg += ` ['${prop_def.values.join("','")}']`;
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


