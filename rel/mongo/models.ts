/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import {atom_book} from 'urn_book';

import mongoose from 'mongoose';

// import {urn_util} from 'urn-lib';

import {AtomName} from '../../types';

import {core_config} from '../../conf/defaults';

import {ConnectionName} from './types';

import {generate_mongo_schema_def} from './schema';

import * as mongo_connection from './connection';

const mongo_main_conn = mongo_connection.create(
	'main',
	core_config.db_host,
	core_config.db_port,
	core_config.db_name
);

const mongo_trash_conn = mongo_connection.create(
	'trash',
	core_config.db_host,
	core_config.db_port,
	core_config.db_trash_name
);

function _create_main_models(){
	const model_by_atom_name = new Map<AtomName, mongoose.Model<mongoose.Document<any>>>();
	let atom_name:AtomName;
	for(atom_name in atom_book){
		const atom_schema_def = generate_mongo_schema_def(atom_name);
		const atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false });
		const atom_model = mongo_main_conn.create_model(atom_name, atom_mongo_schema);
		model_by_atom_name.set(atom_name, atom_model);
	}
	return model_by_atom_name;
}

function _create_trash_models(){
	const model_by_atom_name = new Map<AtomName, mongoose.Model<mongoose.Document<any>>>();
	let atom_name:AtomName;
	for(atom_name in atom_book){
		const atom_schema_def = _convert_for_trash(generate_mongo_schema_def(atom_name));
		const atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
		const atom_model = mongo_trash_conn.create_model(atom_name, atom_mongo_schema);
		model_by_atom_name.set(atom_name, atom_model);
	}
	return model_by_atom_name;
}

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

function _convert_for_trash(schema_definition:mongoose.SchemaDefinition)
		:mongoose.SchemaDefinition{
	const schema_without_unique:mongoose.SchemaDefinition = {...schema_definition};
	for(const [k] of Object.entries(schema_without_unique)){
		schema_without_unique[k] = {type:'Mixed'};
	}
	return schema_without_unique;
}

const main_connection_models = _create_main_models();

const trash_connection_models = _create_trash_models();

const models_by_connection = new Map<ConnectionName, Map<AtomName, mongoose.Model<mongoose.Document<any>>>>();
models_by_connection.set('main', main_connection_models);
models_by_connection.set('trash', trash_connection_models);

export {models_by_connection};



