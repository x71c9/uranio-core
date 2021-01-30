/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import {atom_book} from '@book';

import mongoose from 'mongoose';

// import {urn_exception, urn_util} from 'urn-lib';
import {urn_util} from 'urn-lib';

// const urn_exc = urn_exception.init('MONGO_SCHEMA', 'Mongoose Schema Definition');

import * as urn_atm from '../../atm/';

import {
	BookPropertyType,
	Book,
	AtomName,
	atom_hard_properties,
	atom_common_properties
} from '../../types';

// function _generate_schemas(){
//   const schema_by_atom_name = new Map<AtomName, mongoose.SchemaDefinition>();
//   let atom_name:AtomName;
//   for(atom_name in atom_book){
//     schema_by_atom_name.set(atom_name, _generate_mongo_schema_def(atom_name));
//   }
//   return schema_by_atom_name;
// }

// const _mongo_schema_by_atom_name = _generate_schemas();

export function generate_mongo_schema_def<A extends AtomName>(atom_name:A)
		:mongoose.SchemaDefinition{
	const props_def = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	const properties = {
		...atom_hard_properties,
		...atom_common_properties,
		...props_def
	};
	let mongoose_schema_def = {};
	for(const [k,v] of Object.entries(properties)){
		if(k === '_id')
			continue;
		mongoose_schema_def = {
			...mongoose_schema_def,
			[k]: {..._generate_mongoose_schema_type_options(atom_name, v, k)}
		};
	}
	// console.log(mongoose_schema_def);
	return mongoose_schema_def;
}

function _generate_mongoose_schema_type_options(atom_name: AtomName, prop_def:Book.Definition.Property, prop_key:string)
		:mongoose.SchemaTypeOptions<any>{
	let is_required = true;
	if(prop_def.optional && prop_def.optional === true){
		is_required = false;
	}
	if(urn_util.object.has_key(atom_hard_properties, prop_key)){
		is_required = false;
	}
	let schema_type_options:mongoose.SchemaTypeOptions<any> = {
		required: is_required
	};
	if(prop_def.unique && prop_def.unique === true){
		schema_type_options = {
			...schema_type_options,
			...{unique: true}
		};
	}
	switch(prop_def.type){
		case BookPropertyType.ID:{
			schema_type_options = {
				...schema_type_options,
				type: mongoose.Schema.Types.ObjectId
			};
			return schema_type_options;
		}
		case BookPropertyType.TEXT:{
			return _generate_string_schema_options(prop_def, schema_type_options);
		}
		case BookPropertyType.LONG_TEXT:{
			return _generate_string_schema_options(prop_def, schema_type_options);
		}
		case BookPropertyType.ENCRYPTED:{
			schema_type_options = {
				...schema_type_options,
				type: String,
				minlength: 60,
				maxlenght: 60
			};
			return schema_type_options;
		}
		case BookPropertyType.EMAIL:{
			schema_type_options = {
				...schema_type_options,
				match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				type: String,
				trim: true
			};
			return schema_type_options;
		}
		case BookPropertyType.INTEGER:{
			return _generate_number_schema_options(prop_def, schema_type_options);
		}
		case BookPropertyType.FLOAT:{
			return _generate_number_schema_options(prop_def, schema_type_options);
		}
		case BookPropertyType.BINARY:{
			schema_type_options = {
				...schema_type_options,
				type: Boolean
			};
			return schema_type_options;
		}
		case BookPropertyType.TIME:{
			return _generate_date_schema_options(prop_def, schema_type_options);
		}
		case BookPropertyType.ENUM_STRING:{
			return _generate_enum_schema_options(prop_def, schema_type_options, 'string');
		}
		case BookPropertyType.ENUM_NUMBER:{
			return _generate_enum_schema_options(prop_def, schema_type_options, 'number');
		}
		case BookPropertyType.SET_STRING:{
			schema_type_options = {
				...schema_type_options,
				type: [String]
			};
			return schema_type_options;
		}
		case BookPropertyType.SET_NUMBER:{
			schema_type_options = {
				...schema_type_options,
				type: [Number]
			};
			return schema_type_options;
		}
		case BookPropertyType.ATOM:{
			schema_type_options = {
				...schema_type_options,
				type: mongoose.Schema.Types.ObjectId,
				ref: urn_atm.get_subatom_name(atom_name, prop_key)
			};
			return schema_type_options;
		}
		case BookPropertyType.ATOM_ARRAY:{
			schema_type_options = {
				...schema_type_options,
				type: [mongoose.Schema.Types.ObjectId],
				ref: urn_atm.get_subatom_name(atom_name, prop_key)
			};
			return schema_type_options;
		}
	}
	// const err_msg = `Invalid Atom property type for key [${prop_key}]`;
	// throw urn_exc.create('CREATE_PROP_SCHEMA_INVALID_TYPE', err_msg);
}

function _generate_date_schema_options(
	prop_def: Book.Definition.Property.Time,
	schema_type_options: mongoose.SchemaTypeOptions<any>
):mongoose.SchemaTypeOptions<Date>{
	schema_type_options = {
		...schema_type_options,
		type: Date
	};
	if(prop_def.default){
		schema_type_options = {
			...schema_type_options,
			default: (prop_def.default === 'NOW') ? Date.now : prop_def.default
		};
	}
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			schema_type_options = {
				...schema_type_options,
				min: vali.eq as any,
				max: vali.eq as any
			};
		}else{
			if(vali.min){
				schema_type_options = {
					...schema_type_options,
					min: vali.min as any
				};
			}
			if(vali.max){
				schema_type_options = {
					...schema_type_options,
					max: vali.max as any
				};
			}
		}
	}
	return schema_type_options;
}

function _generate_enum_schema_options(
	prop_def: Book.Definition.Property.Enum,
	schema_type_options: mongoose.SchemaTypeOptions<any>,
	type: 'string' | 'number'
):mongoose.SchemaTypeOptions<number | string>{
	schema_type_options = {
		...schema_type_options,
		type: (type === 'number') ? Number : String,
		enum: prop_def.values
	};
	if(prop_def.default){
		schema_type_options = {
			...schema_type_options,
			default: prop_def.default
		};
	}
	return schema_type_options;
}

function _generate_number_schema_options(
	prop_def:Book.Definition.Property.Number,
	schema_type_options:mongoose.SchemaTypeOptions<any>
):mongoose.SchemaTypeOptions<number>{
	schema_type_options = {
		...schema_type_options,
		type: Number
	};
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			schema_type_options = {
				...schema_type_options,
				min: vali.eq,
				max: vali.eq
			};
		}else{
			if(vali.min){
				schema_type_options = {
					...schema_type_options,
					min: vali.min
				};
			}
			if(vali.max){
				schema_type_options = {
					...schema_type_options,
					max: vali.max
				};
			}
		}
	}
	return schema_type_options;
}

function _generate_string_schema_options(
	prop_def: Book.Definition.Property.String,
	schema_type_options: mongoose.SchemaTypeOptions<any>
):mongoose.SchemaTypeOptions<string>{
	schema_type_options = {
		...schema_type_options,
		type: String,
		trim: true
	};
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			schema_type_options = {
				...schema_type_options,
				minlength: vali.length,
				maxlenght: vali.length
			};
		}else{
			if(vali.min){
				schema_type_options = {
					...schema_type_options,
					minlength: vali.min
				};
			}
			if(vali.max){
				schema_type_options = {
					...schema_type_options,
					maxlength: vali.max
				};
			}
		}
		if(vali.reg_ex){
			schema_type_options = {
				...schema_type_options,
				match: vali.reg_ex
			};
		}
	}
	return schema_type_options;
}

