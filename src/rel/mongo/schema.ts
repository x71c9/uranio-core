/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

// import {urn_exception, urn_util} from 'urn-lib';
import {urn_util} from 'urn-lib';

// const urn_exc = urn_exception.init('MONGO_SCHEMA', 'Mongoose Schema Definition');

import {
	BookPropertyType,
	Book,
	AtomName,
	atom_hard_properties,
	atom_common_properties
} from '../../types';

import {atom_book} from '../../book';

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
			..._generate_mongoose_schema_prop(v, k)
		};
	}
	// console.log(mongoose_schema_def);
	return mongoose_schema_def;
}

function _generate_mongoose_schema_prop(prop_def:Book.Definition.Property, prop_key:string)
		:mongoose.SchemaDefinition{
	let is_required = true;
	if(prop_def.optional && prop_def.optional === true){
		is_required = false;
	}
	if(urn_util.object.has_key(atom_hard_properties, prop_key)){
		is_required = false;
	}
	const schema_prop = {
		[prop_key]:{
			required: is_required
		}
	} as mongoose.SchemaDefinition;
	if(prop_def.unique && prop_def.unique === true){
		schema_prop[prop_key] = {
			...schema_prop[prop_key] as mongoose.SchemaDefinition,
			unique: true
		};
	}
	switch(prop_def.type){
		case BookPropertyType.ID:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case BookPropertyType.TEXT:{
			return _generate_string_schema_def(prop_def, prop_key, schema_prop);
		}
		case BookPropertyType.LONG_TEXT:{
			return _generate_string_schema_def(prop_def, prop_key, schema_prop);
		}
		case BookPropertyType.ENCRYPTED:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: String,
				minlength: 60,
				maxlenght: 60
			};
			return schema_prop;
		}
		case BookPropertyType.EMAIL:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case BookPropertyType.INTEGER:{
			return _generate_number_schema_def(prop_def, prop_key, schema_prop);
		}
		case BookPropertyType.FLOAT:{
			return _generate_number_schema_def(prop_def, prop_key, schema_prop);
		}
		case BookPropertyType.BINARY:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: Boolean
			};
			return schema_prop;
		}
		case BookPropertyType.TIME:{
			return _generate_date_schema_def(prop_def, prop_key, schema_prop);
		}
		case BookPropertyType.ENUM_STRING:{
			return _generate_enum_schema_def(prop_def, prop_key, schema_prop, 'string');
		}
		case BookPropertyType.ENUM_NUMBER:{
			return _generate_enum_schema_def(prop_def, prop_key, schema_prop, 'number');
		}
		case BookPropertyType.SET_STRING:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: [String]
			};
			return schema_prop;
		}
		case BookPropertyType.SET_NUMBER:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: [Number]
			};
			return schema_prop;
		}
		case BookPropertyType.ATOM:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: 'Mixed'
			};
			return schema_prop;
		}
		case BookPropertyType.ATOM_ARRAY:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				type: 'Mixed'
			};
			return schema_prop;
		}
	}
	// const err_msg = `Invalid Atom property type for key [${prop_key}]`;
	// throw urn_exc.create('CREATE_PROP_SCHEMA_INVALID_TYPE', err_msg);
}

function _generate_date_schema_def(
	prop_def: Book.Definition.Property.Time,
	prop_key: string,
	schema_prop: mongoose.SchemaDefinition
):mongoose.SchemaDefinition{
	schema_prop[prop_key] = {
		...schema_prop[prop_key] as mongoose.SchemaDefinition,
		type: Date
	};
	if(prop_def.default){
		schema_prop[prop_key] = {
			...schema_prop[prop_key] as mongoose.SchemaDefinition,
			default: (prop_def.default === 'NOW') ? Date.now : prop_def.default
		};
	}
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				min: vali.eq,
				max: vali.eq
			};
		}else{
			if(vali.min){
				schema_prop[prop_key] = {
					...schema_prop[prop_key] as mongoose.SchemaDefinition,
					min: vali.min
				};
			}
			if(vali.max){
				schema_prop[prop_key] = {
					...schema_prop[prop_key] as mongoose.SchemaDefinition,
					max: vali.max
				};
			}
		}
	}
	return schema_prop;
}

function _generate_enum_schema_def(
	prop_def: Book.Definition.Property.Enum,
	prop_key: string,
	schema_prop: mongoose.SchemaDefinition,
	type: 'string' | 'number'
):mongoose.SchemaDefinition{
	schema_prop[prop_key] = {
		...schema_prop,
		type: (type === 'number') ? Number : String,
		enum: prop_def.values
	};
	if(prop_def.default){
		schema_prop[prop_key] = {
			...schema_prop[prop_key] as mongoose.SchemaDefinition,
			default: prop_def.default
		};
	}
	return schema_prop;
}

function _generate_number_schema_def(
	prop_def:Book.Definition.Property.Number,
	prop_key: string,
	schema_prop:mongoose.SchemaDefinition
):mongoose.SchemaDefinition{
	schema_prop[prop_key] = {
		...schema_prop[prop_key] as mongoose.SchemaDefinition,
		type: Number
	};
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.eq){
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				min: vali.eq,
				max: vali.eq
			};
		}else{
			if(vali.min){
				schema_prop[prop_key] = {
					...schema_prop[prop_key] as mongoose.SchemaDefinition,
					min: vali.min
				};
			}
			if(vali.max){
				schema_prop[prop_key] = {
					...schema_prop[prop_key] as mongoose.SchemaDefinition,
					max: vali.max
				};
			}
		}
	}
	return schema_prop;
}

function _generate_string_schema_def(
	prop_def: Book.Definition.Property.String,
	prop_key: string,
	schema_prop: mongoose.SchemaDefinition
):mongoose.SchemaDefinition{
	schema_prop[prop_key] = {
		...schema_prop[prop_key] as mongoose.SchemaDefinition,
		type: String,
		trim: true
	};
	if(prop_def.validation){
		const vali = prop_def.validation;
		if(vali.length){
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				minlength: vali.length,
				maxlenght: vali.length
			};
		}else{
			if(vali.min){
				schema_prop[prop_key] = {
					...schema_prop[prop_key] as mongoose.SchemaDefinition,
					minlength: vali.min
				};
			}
			if(vali.max){
				schema_prop[prop_key] = {
					...schema_prop[prop_key] as mongoose.SchemaDefinition,
					maxlength: vali.max
				};
			}
		}
		if(vali.reg_ex){
			schema_prop[prop_key] = {
				...schema_prop[prop_key] as mongoose.SchemaDefinition,
				match: vali.reg_ex
			};
		}
	}
	return schema_prop;
}


// type JSTypes = 'string' | 'number' | 'boolean' | 'object' | Date;

// function _check_string_validation_property<A extends AtomName>
// (prop_key:keyof Atom<A>, prop_validation:AtomPropertyDefinitionValidation)
//     :true{
//   if(urn_util.object.has_key(prop_validation, 'min')){
//     _check_validation_property_type<A>(prop_key, 'min', 'number');
//   }
//   if(urn_util.object.has_key(prop_validation, 'max')){
//     _check_validation_property_type<A>(prop_key, 'max', 'number');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   if(urn_util.object.has_key(prop_validation, 'alphanum')){
//     _check_validation_property_type<A>(prop_key, 'alphanum', 'boolean');
//   }
//   return true;
// }

// function _check_validation_property_type<A extends AtomName>
// (prop_key:keyof Atom<A>, key:string, type:JSTypes)
//     :true{
//   if(typeof key !== type){
//     let err_msg = `Invalid validation object for key [${prop_key}].`;
//     err_msg += ` Property [${key}] has invalid type. It should be [${type}].`;
//     err_msg += ` Given type [${typeof key}]`;
//     throw urn_exc.create(`GENERATE_MONGO_SCHEMA_DEF`, err_msg);
//   }
//   return true;
// }

// function _allow_duplicate(schema_definition:mongoose.SchemaDefinition)
//     :mongoose.SchemaDefinition{
//   const schema_without_unique:mongoose.SchemaDefinition = {...schema_definition};
//   for(const [k] of Object.entries(schema_without_unique)){
//     if(urn_util.object.has_key(schema_without_unique[k], 'unique')){
//       delete (schema_without_unique[k] as any).unique;
//     }
//   }
//   return schema_without_unique;
// }


// export const user_schema_definition:mongoose.SchemaDefinition = {
//   // ...default_atom_schema,
//   first_name: {
//     type: String,
//     trim: true,
//     match: /^[a-zA-z -]+$/,
//     set: (v:string):string =>
//       (v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1){
//         return $1.toUpperCase();
//       }),
//     minlenght: 2,
//     maxlenght: 255,
//     required: true
//   },
//   last_name: {
//     type: String,
//     trim: true,
//     match: /^[a-zA-z -]+$/,
//     set: (v:string):string =>
//       (v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1){
//         return $1.toUpperCase();
//       }),
//     minlenght: 2,
//     maxlenght: 255,
//     required: true
//   },
//   username: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     match: /^[a-z0-9_-]+$/,
//     minlenght: 3,
//     maxlenght: 255,
//     unique: true,
//     required: true
//   },
//   email:{
//     type: String,
//     trim: true,
//     lowercase: true,
//     // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//     match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//     maxlenght: 255,
//     unique: true,
//     required: true
//   },
//   type:{
//     type: String,
//     default: 'default',
//     enum: ['default','pro'],
//     required: true
//   },
//   active: {
//     type: Boolean,
//     default: false,
//     required: true
//   },
//   password:{
//     type: String,
//     trim: true,
//     match: /^[^ \t\r+]+$/,
//     minlenght: 8,
//     maxlenght: 255,
//     required: true
//   }
// };


