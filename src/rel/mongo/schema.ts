/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_util} from 'urn-lib';

import {schema} from '../../sch/server';

import {atom_hard_properties} from '../../stc/server';

import * as atm_util from '../../atm/util';

import * as book from '../../book/server';

import {Book, PropertyType} from '../../typ/book_srv';

export function generate_mongo_schema_def<A extends schema.AtomName>(atom_name:A)
		:mongoose.SchemaDefinition{
	const properties = book.get_full_properties_definition(atom_name);
	let mongoose_schema_def = {};
	for(const [k,v] of Object.entries(properties)){
		if(k === '_id')
			continue;
		mongoose_schema_def = {
			...mongoose_schema_def,
			[k]: {..._generate_mongoose_schema_type_options(atom_name, v, k)}
		};
	}
	return mongoose_schema_def;
}

function _generate_mongoose_schema_type_options(atom_name: schema.AtomName, prop_def:Book.Definition.Property, prop_key:string)
		:mongoose.SchemaTypeOptions<any>{
	let is_required = true;
	if(prop_def.optional && prop_def.optional === true){
		is_required = false;
	}
	if(urn_util.object.has_key(atom_hard_properties, prop_key)){
		is_required = false;
	}
	let schema_type_options:mongoose.SchemaTypeOptions<any> = {
		type: undefined,
		required: is_required
	};
	if(prop_def.unique && prop_def.unique === true){
		schema_type_options = {
			...schema_type_options,
			...{unique: true}
		};
	}
	switch(prop_def.type){
		case PropertyType.ID:{
			schema_type_options = {
				...schema_type_options,
				type: mongoose.Schema.Types.ObjectId
			};
			return schema_type_options;
		}
		case PropertyType.TEXT:{
			return _generate_string_schema_options(prop_def, schema_type_options);
		}
		case PropertyType.LONG_TEXT:{
			return _generate_string_schema_options(prop_def, schema_type_options);
		}
		case PropertyType.ENCRYPTED:{
			schema_type_options = {
				...schema_type_options,
				type: String,
				minlength: 60,
				maxlenght: 60
			};
			return schema_type_options;
		}
		case PropertyType.EMAIL:{
			schema_type_options = {
				...schema_type_options,
				match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				type: String,
				trim: true
			};
			return schema_type_options;
		}
		case PropertyType.INTEGER:{
			return _generate_number_schema_options(prop_def, schema_type_options);
		}
		case PropertyType.FLOAT:{
			return _generate_number_schema_options(prop_def, schema_type_options);
		}
		case PropertyType.BINARY:{
			schema_type_options = {
				...schema_type_options,
				type: Boolean
			};
			return schema_type_options;
		}
		case PropertyType.DAY:
		case PropertyType.TIME:{
			return _generate_date_schema_options(prop_def, schema_type_options);
		}
		case PropertyType.ENUM_STRING:{
			return _generate_enum_schema_options(prop_def, schema_type_options, 'string');
		}
		case PropertyType.ENUM_NUMBER:{
			return _generate_enum_schema_options(prop_def, schema_type_options, 'number');
		}
		case PropertyType.SET_STRING:{
			schema_type_options = {
				...schema_type_options,
				type: [String]
			};
			return schema_type_options;
		}
		case PropertyType.SET_NUMBER:{
			schema_type_options = {
				...schema_type_options,
				type: [Number]
			};
			return schema_type_options;
		}
		case PropertyType.ATOM:{
			schema_type_options = {
				...schema_type_options,
				type: mongoose.Schema.Types.ObjectId,
				ref: atm_util.get_subatom_name(atom_name, prop_key)
			};
			return schema_type_options;
		}
		case PropertyType.ATOM_ARRAY:{
			schema_type_options = {
				...schema_type_options,
				type: [mongoose.Schema.Types.ObjectId],
				ref: atm_util.get_subatom_name(atom_name, prop_key)
			};
			return schema_type_options;
		}
	}
	// const err_msg = `Invalid schema.schema.Atom property type for key [${prop_key}]`;
	// throw urn_exc.create('CREATE_PROP_SCHEMA_INVALID_TYPE', err_msg);
}

function _generate_date_schema_options(
	prop_def: Book.Definition.Property.DayTime,
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

