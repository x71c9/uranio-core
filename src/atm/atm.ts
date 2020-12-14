/**
 *
 * Module for Atom
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init(`ATM`, `Atom module`);

import {
	AtomName,
	KeyOfAtom,
	AtomPropertiesDefinition,
	AtomPropertyDefinition,
	Atom,
	AtomShape,
	PropertiesOfAtomDefinition,
	AtomPropertyType
} from '../types';

import {atom_book} from '../book';

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
	return unique_keys;
}

export function validate<A extends AtomName>(atom_name:A, atom:Atom<A>)
		:true{
	_validate_default_properties(atom);
	_has_all_properties<A>(atom_name, atom);
	_has_no_other_properties<A>(atom_name, atom);
	_properties_have_correct_type<A>(atom_name, atom);
	return true;
}

export function validate_shape<A extends AtomName>(atom_name:A, atom_shape:AtomShape<A>)
		:true{
	_has_all_properties<A>(atom_name, atom_shape);
	_has_no_other_properties<A>(atom_name, atom_shape);
	_properties_have_correct_type<A>(atom_name, atom_shape);
	return true;
}

export function validate_partial<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>)
		:true{
	_has_no_other_properties(atom_name, partial_atom);
	_properties_have_correct_type(atom_name, partial_atom);
	return true;
}

function _validate_default_properties<A extends AtomName>(atom:Atom<A>)
		:true{
	if(!urn_util.object.has_key(atom, '_id') || typeof atom._id !== 'string'){
		const err_msg = `Invalid or missing property [_id].`;
		throw urn_exc.create('VALIDATE_INVALID_DEF_PROP', err_msg);
	}
	if(!urn_util.object.has_key(atom, 'date') || !urn_util.is.date(atom.date)){
		const err_msg = `Invalid or missing property [date].`;
		throw urn_exc.create('VALIDATE_INVALID_DEF_PROP', err_msg);
	}
	if(urn_util.object.has_key(atom, '_deleted_from') && typeof atom._deleted_from !== 'string'){
		const err_msg = `Invalid property [_deleted_from].`;
		throw urn_exc.create('VALIDATE_INVALID_DEF_PROP', err_msg);
	}
	return true;
}

function _has_all_properties<A extends AtomName>(atom_name:A, atom_shape:AtomShape<A>)
		:true{
	const atom_properties = atom_book[atom_name]['properties'] as PropertiesOfAtomDefinition<A>;
	const missin_props:KeyOfAtom<A>[] = [];
	for(const k in atom_properties){
		if(!urn_util.object.has_key(atom_shape,k)){
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
	const atom_properties = atom_book[atom_name]['properties'] as PropertiesOfAtomDefinition<A>;
	const extra_props:string[] = [];
	for(const k in partial_atom){
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
	// let k:KeyOfAtom<A>;
	const props = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	for(const k in partial_atom){
		const prop_def = props[k];
		_check_prop(prop_def.type, k, partial_atom[k]);
	}
	return true;
}

function _check_prop(
	prop_type: AtomPropertyType,
	prop_key: string,
	prop_value:any
):true{
	switch(prop_type){
		case AtomPropertyType.ID:
		case AtomPropertyType.TEXT:
		case AtomPropertyType.LONG_TEXT:
		case AtomPropertyType.ENCRYPTED:
		case AtomPropertyType.EMAIL:{
			if(typeof prop_value !== 'string'){
				throw urn_exc.create('INVALID_PROP', `Invalid property [${prop_key}]`);
			}
			return true;
		}
		case AtomPropertyType.INTEGER:
		case AtomPropertyType.FLOAT:{
			if(typeof prop_value !== 'number'){
				throw urn_exc.create('INVALID_PROP', `Invalid property [${prop_key}]`);
			}
			return true;
		}
		case AtomPropertyType.BINARY:{
			if(typeof prop_value !== 'boolean'){
				throw urn_exc.create('INVALID_PROP', `Invalid property [${prop_key}]`);
			}
			return true;
		}
		case AtomPropertyType.TIME:{
			if(!urn_util.is.date(prop_value)){
				throw urn_exc.create('INVALID_PROP', `Invalid property [${prop_key}]`);
			}
			return true;
		}
		case AtomPropertyType.SET:{
			if(!Array.isArray(prop_value)){
				throw urn_exc.create('INVALID_PROP', `Invalid property [${prop_key}]`);
			}
			return true;
		}
		case AtomPropertyType.ATOM:{
			return true;
		}
	}
}


