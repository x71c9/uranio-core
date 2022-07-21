/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

// import {urn_util, urn_exception} from 'urn-lib';
import {urn_util} from 'urn-lib';

import {schema} from '../../sch/server';

// const urn_exc = urn_exception.init('MONGO_APP', 'Mongoose Models App');

import {ConnectionName} from '../../typ/book_cln';

import {Environment} from '../../typ/env';

import * as atm from '../../atm/server';

import * as env from '../../env/server';

import {generate_mongo_schema_def} from './schema';

import * as mongo_connection from './connection';

import * as book from '../../book/server';

import {PropertyType} from '../../typ/book';

export const mongo_app:MongoApp = {};

export function create_all_connection():void{
	_create_connection('main');
	_create_connection('trash');
	_create_connection('log');
}

export function get_model(conn_name:ConnectionName, atom_name:schema.AtomName)
		:mongoose.Model<mongoose.Document<any>>{
	
	_create_connection(conn_name);
	
	if(!mongo_app.models){
		mongo_app.models = {} as MongoModels;
	}
	if(!mongo_app.models[conn_name]){
		switch(conn_name){
			case 'main':{
				mongo_app.models.main = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
				break;
			}
			case 'log':{
				mongo_app.models.log = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
				break;
			}
			case 'trash':{
				mongo_app.models.trash = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
				break;
			}
		}
	}
	// if(!mongo_app.models[conn_name]){
	// 	switch(conn_name){
	// 		case 'main':{
	// 			const undefined_connection_models = _create_models(mongo_app.connections!.main);
	// 			const main_connection_models = _create_models(mongo_app.connections!.main, 'main');
	// 			mongo_app.models.main = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>(
	// 				[...undefined_connection_models, ...main_connection_models]
	// 			);
	// 			break;
	// 		}
	// 		case 'log':{
	// 			mongo_app.models.log = _create_models(mongo_app.connections!.log, 'log');
	// 			break;
	// 		}
	// 		case 'trash':{
	// 			const model_by_atom_name = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
	// 			let atom_name:schema.AtomName;
	// 			for(atom_name of book.get_names()){
	// 				const atom_def = book.get_definition(atom_name);
	// 				if(atom_def.connection && atom_def.connection !== 'main'){
	// 					continue;
	// 				}
	// 				const atom_schema_def = _convert_for_trash(generate_mongo_schema_def(atom_name));
	// 				let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
					
	// 				atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
					
	// 				const atom_model = mongo_app.connections!.trash.create_model(atom_name, atom_mongo_schema);
	// 				model_by_atom_name.set(atom_name, atom_model);
	// 			}
	// 			mongo_app.models.trash = model_by_atom_name;
	// 			break;
	// 		}
	// 	}
	// }
	let model = mongo_app.models[conn_name].get(atom_name);
	if(!model){
		switch(conn_name){
			case 'main':{
				model = _create_model(atom_name, mongo_app.connections!.main, 'main');
				break;
			}
			case 'log':{
				model = _create_model(atom_name, mongo_app.connections!.log, 'log');
				break;
			}
			case 'trash':{
				model = _create_model(atom_name, mongo_app.connections!.trash, 'trash');
				break;
			}
		}
		// throw urn_exc.create(
		// 	`NO_MODEL_FOUND`,
		// 	`Cannot find model for atom \`${atom_name}\` in connection \`${conn_name}\``
		// );
	}
	return model;
}

function _create_model(
	atom_name:schema.AtomName,
	mongoose_db_connection:mongo_connection.ConnectionInstance,
	connection:ConnectionName,
):mongoose.Model<mongoose.Document<any>>{
	
	if(connection === 'trash'){
		
		const atom_schema_def = _convert_for_trash(generate_mongo_schema_def(atom_name));
		let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
		
		atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
		
		const atom_model = mongo_app.connections!.trash.create_model(atom_name, atom_mongo_schema);
		return atom_model;
		
	}else{
		
		const atom_schema_def = generate_mongo_schema_def(atom_name);
		let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
		
		atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
		
		const conn_name = (!connection) ? 'main' : connection;
		atom_mongo_schema = _add_schema_middleware(atom_name, conn_name, atom_mongo_schema);
		
		const atom_model = mongoose_db_connection.create_model(atom_name, atom_mongo_schema);
		return atom_model;
		
	}
	
}

// function _create_models(mongoose_db_connection:mongo_connection.ConnectionInstance, connection?:ConnectionName){
// 	const model_by_atom_name = new Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>();
// 	let atom_name:schema.AtomName;
// 	for(atom_name of book.get_names()){
// 		const atom_def = book.get_definition(atom_name);
// 		if(atom_def.connection !== connection){
// 			continue;
// 		}
// 		const atom_schema_def = generate_mongo_schema_def(atom_name);
// 		let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
		
// 		atom_mongo_schema = _add_text_indexes(atom_mongo_schema, atom_name);
		
// 		const conn_name = (!connection) ? 'main' : connection;
// 		atom_mongo_schema = _add_schema_middleware(atom_name, conn_name, atom_mongo_schema);
		
// 		const atom_model = mongoose_db_connection.create_model(atom_name, atom_mongo_schema);
// 		model_by_atom_name.set(atom_name, atom_model);
// 	}
// 	return model_by_atom_name;
// }

function _add_text_indexes(atom_mongo_schema:mongoose.Schema, atom_name:schema.AtomName){
	const searchable_indexed = atm.keys.get_search_indexes(atom_name);
	const mongo_indexes:{[k:string]: 'text'} = {};
	for(const k of searchable_indexed){
		mongo_indexes[k] = 'text';
	}
	atom_mongo_schema.index(mongo_indexes, { default_language: "english" });
	return atom_mongo_schema;
}

function _convert_for_trash(schema_definition:mongoose.SchemaDefinition)
		:mongoose.SchemaDefinition{
	const schema_without_unique:mongoose.SchemaDefinition =
		urn_util.object.deep_clone(schema_definition);
	for(const [k] of Object.entries(schema_without_unique)){
		schema_without_unique[k] = {type:'Mixed'};
	}
	return schema_without_unique;
}

async function _delete_cascade(
	conn_name: ConnectionName,
	atom_by_cascade_keys: Map<string, schema.AtomName>,
	document: any
){
	if(!document){
		return false;
	}
	// const conn_models = models_by_connection.get(conn_name);
	const conn_models = mongo_app.models?.[conn_name];
	if(!conn_models){
		return false;
	}
	for(const [k, atom_name] of atom_by_cascade_keys){
		const model = conn_models.get(atom_name);
		if(!model || !document[k]){
			continue;
		}
		if(Array.isArray(document[k])){
			const valid_ids = [];
			for(const id of document[k]){
				if(mongoose.Types.ObjectId.isValid(id)){
					valid_ids.push(id);
				}
			}
			await model.deleteMany({_id: {$in: valid_ids}});
		}else if(mongoose.Types.ObjectId.isValid(document[k])){
			await model.findOneAndDelete({_id: document[k]});
		}
	}
}

function _add_schema_middleware<A extends schema.AtomName>(
	atom_name:A,
	conn_name:ConnectionName,
	mongo_schema:mongoose.Schema
):mongoose.Schema{
	
	// DELETE ON CASCADE
	const prop_defs = book.get_custom_properties_definition(atom_name);
	const atom_by_cascade_keys = new Map<string, schema.AtomName>();
	for(const [k,v] of Object.entries(prop_defs)){
		if(v.type === PropertyType.ATOM || v.type === PropertyType.ATOM_ARRAY){
			if(v.delete_cascade && v.delete_cascade === true){
				atom_by_cascade_keys.set(k, v.atom);
			}
		}
	}
	mongo_schema.post('findOneAndDelete', async (document:any) => {
		await _delete_cascade(conn_name, atom_by_cascade_keys, document);
	});
	mongo_schema.post('deleteMany', async (document:any) => {
		await _delete_cascade(conn_name, atom_by_cascade_keys, document);
	});
	mongo_schema.post('remove', async (document:any) => {
		await _delete_cascade(conn_name, atom_by_cascade_keys, document);
	});
	
	return mongo_schema;
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

// const main_connection_models = _create_main_models();

// const trash_connection_models = _create_trash_models();

// const log_connection_models = _create_log_models();

// const models_by_connection = new Map<ConnectionName, Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>>();
// models_by_connection.set('main', main_connection_models);
// models_by_connection.set('trash', trash_connection_models);
// models_by_connection.set('log', log_connection_models);

type MongoApp = {
	connections?: MongoConnections
	models?: MongoModels
}

type MongoConnections = {
	[k in ConnectionName]: mongo_connection.ConnectionInstance
}

type MongoModels = {
	[k in ConnectionName]: Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>
}

function _create_connection(conn_name:ConnectionName){
	if(!mongo_app.connections){
		mongo_app.connections = {} as MongoConnections;
	}
	if(!mongo_app.connections[conn_name]){
		const mongo_conn_string = env.get(`mongo_${conn_name}_connection` as keyof Environment);
		const mongo_db_string = env.get(`db_${conn_name}_name` as keyof Environment);
		
		const conf_connection_name = (conn_name !== 'main' && typeof mongo_conn_string === 'string') ?
			mongo_conn_string : env.get(`mongo_main_connection`);
		const conf_db_name = (conn_name !== 'main' && typeof mongo_conn_string === 'string') ?
			mongo_db_string : env.get(`db_main_name`) as string;
		
		mongo_app.connections[conn_name] = mongo_connection.create(
			conn_name,
			conf_connection_name,
			conf_db_name as string
		);
	}
}



