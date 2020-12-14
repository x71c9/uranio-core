/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('MONGO_SCHEMA', 'Mongoose Schema Definition');

import {
	AtomName,
	AtomPropertyDefinition,
	AtomPropertiesDefinition,
	AtomPropertyType
} from '../../types';

import {atom_book} from '../../book';

const default_atom_schema = {
	_date: {
		type: Date,
		default: Date.now,
		required: true
	},
	_deleted_from: {
		type: String,
		trim: true
	},
};

export function generate_mongoose_schema<A extends AtomName>(atom_name:A)
		:mongoose.SchemaDefinition{
	const props_def = atom_book[atom_name]['properties'] as AtomPropertiesDefinition;
	let mongoose_schema = {...default_atom_schema};
	for(const k in props_def){
		const atom_prop_def:AtomPropertyDefinition = props_def[k];
		mongoose_schema = {
			...mongoose_schema,
			..._generate_mongoose_schema_prop(atom_prop_def, k)
		};
	}
	return mongoose_schema;
}

export function generate_mongoose_trash_schema<A extends AtomName>(atom_name:A)
		:mongoose.SchemaDefinition{
	return _allow_duplicate(generate_mongoose_schema(atom_name));
}

function _generate_mongoose_schema_prop(prop_def:AtomPropertyDefinition, prop_key:string)
		:mongoose.SchemaDefinition{
	const schema_prop = {
		[prop_key]:{
			required: true
		}
	} as mongoose.SchemaDefinition;
	if(urn_util.object.has_key(prop_def,'unique') && prop_def.unique === true){
		schema_prop[prop_key] = {
			...schema_prop[prop_key],
			unique: true
		};
	}
	switch(prop_def.type){
		case AtomPropertyType.ID:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.TEXT:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.LONG_TEXT:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.ENCRYPTED:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.EMAIL:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				type: String,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.INTEGER:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: Number
			};
			return schema_prop;
		}
		case AtomPropertyType.FLOAT:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: Number
			};
			return schema_prop;
		}
		case AtomPropertyType.BINARY:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: Boolean,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.TIME:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: Date
			};
			return schema_prop;
		}
		case AtomPropertyType.SET:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: Array,
				trim: true
			};
			return schema_prop;
		}
		case AtomPropertyType.ATOM:{
			schema_prop[prop_key] = {
				...schema_prop[prop_key],
				type: 'Mixed'
			};
			return schema_prop;
		}
	}
	const err_msg = `Invalid Atom property type for key [${prop_key}]`;
	throw urn_exc.create('CREATE_PROP_SCHEMA_INVALID_TYPE', err_msg);
}

function _allow_duplicate(schema_definition:mongoose.SchemaDefinition)
		:mongoose.SchemaDefinition{
	const schema_without_unique:mongoose.SchemaDefinition = {...schema_definition};
	for(const [k] of Object.entries(schema_without_unique)){
		if(urn_util.object.has_key(schema_without_unique[k], 'unique')){
			delete (schema_without_unique[k] as any).unique;
		}
	}
	return schema_without_unique;
}


export const user_schema_definition:mongoose.SchemaDefinition = {
	...default_atom_schema,
	first_name: {
		type: String,
		trim: true,
		match: /^[a-zA-z -]+$/,
		set: (v:string):string =>
			(v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1){
				return $1.toUpperCase();
			}),
		minlenght: 2,
		maxlenght: 255,
		required: true
	},
	last_name: {
		type: String,
		trim: true,
		match: /^[a-zA-z -]+$/,
		set: (v:string):string =>
			(v + '').toLowerCase().replace(/^(.)|\s+(.)/g, function ($1){
				return $1.toUpperCase();
			}),
		minlenght: 2,
		maxlenght: 255,
		required: true
	},
	username: {
		type: String,
		trim: true,
		lowercase: true,
		match: /^[a-z0-9_-]+$/,
		minlenght: 3,
		maxlenght: 255,
		unique: true,
		required: true
	},
	email:{
		type: String,
		trim: true,
		lowercase: true,
		// match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
		maxlenght: 255,
		unique: true,
		required: true
	},
	type:{
		type: String,
		default: 'default',
		enum: ['default','pro'],
		required: true
	},
	active: {
		type: Boolean,
		default: false,
		required: true
	},
	password:{
		type: String,
		trim: true,
		match: /^[^ \t\r+]+$/,
		minlenght: 8,
		maxlenght: 255,
		required: true
	}
};


