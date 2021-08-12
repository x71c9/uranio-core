/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_exception} from 'urn-lib';

import {atom_book} from 'uranio-books/atom';

const urn_exc = urn_exception.init('MONGO_APP', 'Mongoose Models App');

import {AtomName} from '../../typ/atom';

import {Book, ConnectionName} from '../../typ/book_srv';

import {BookPropertyType} from '../../typ/common';

import {core_config} from '../../conf/defaults';

import {generate_mongo_schema_def} from './schema';

import * as mongo_connection from './connection';

// const mongo_main_conn = mongo_connection.create(
//   'main',
//   core_config.mongo_main_connection,
//   core_config.db_main_name
// );

// const mongo_trash_conn = mongo_connection.create(
//   'trash',
//   (core_config.mongo_trash_connection) ?
//     core_config.mongo_trash_connection : core_config.mongo_main_connection,
//   core_config.db_trash_name
// );

// const mongo_log_conn = mongo_connection.create(
//   'log',
//   (core_config.mongo_log_connection) ?
//     core_config.mongo_log_connection : core_config.mongo_main_connection,
//   core_config.db_log_name
// );

// function _create_main_models(){
//   const undefined_connection_models = _create_models(mongo_main_conn);
//   const main_connection_models = _create_models(mongo_main_conn, 'main');
//   return new Map<AtomName, mongoose.Model<mongoose.Document<any>>>(
//     [...undefined_connection_models, ...main_connection_models]
//   );
// }

// function _create_log_models(){
//   return _create_models(mongo_log_conn, 'log');
// }

// function _create_trash_models(){
//   const model_by_atom_name = new Map<AtomName, mongoose.Model<mongoose.Document<any>>>();
//   let atom_name:AtomName;
//   for(atom_name in atom_book){
//     const atom_def = atom_book[atom_name] as Book.BasicDefinition;
//     if(atom_def.connection && atom_def.connection !== 'main')
//       continue;
//     const atom_schema_def = _convert_for_trash(generate_mongo_schema_def(atom_name));
//     const atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
//     const atom_model = mongo_trash_conn.create_model(atom_name, atom_mongo_schema);
//     model_by_atom_name.set(atom_name, atom_model);
//   }
//   return model_by_atom_name;
// }

function _create_models(mongoose_db_connection:mongo_connection.ConnectionInstance, connection?:ConnectionName){
	const model_by_atom_name = new Map<AtomName, mongoose.Model<mongoose.Document<any>>>();
	let atom_name:AtomName;
	for(atom_name in atom_book){
		const atom_def = atom_book[atom_name] as Book.BasicDefinition;
		if(atom_def.connection !== connection)
			continue;
		const atom_schema_def = generate_mongo_schema_def(atom_name);
		let atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
		
		const conn_name = (!connection) ? 'main' : connection;
		atom_mongo_schema = _add_schema_middleware(atom_name, conn_name, atom_mongo_schema);
		
		const atom_model = mongoose_db_connection.create_model(atom_name, atom_mongo_schema);
		model_by_atom_name.set(atom_name, atom_model);
	}
	return model_by_atom_name;
}

function _convert_for_trash(schema_definition:mongoose.SchemaDefinition)
		:mongoose.SchemaDefinition{
	const schema_without_unique:mongoose.SchemaDefinition = {...schema_definition};
	for(const [k] of Object.entries(schema_without_unique)){
		schema_without_unique[k] = {type:'Mixed'};
	}
	return schema_without_unique;
}

async function _delete_cascade(
	conn_name: ConnectionName,
	atom_by_cascade_keys: Map<string, AtomName>,
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

function _add_schema_middleware<A extends AtomName>(
	atom_name:A,
	conn_name:ConnectionName,
	mongo_schema:mongoose.Schema
):mongoose.Schema{
	
	// DELETE ON CASCADE
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	const atom_by_cascade_keys = new Map<string, AtomName>();
	for(const [k,v] of Object.entries(atom_props)){
		if(v.type === BookPropertyType.ATOM || v.type === BookPropertyType.ATOM_ARRAY){
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

// const models_by_connection = new Map<ConnectionName, Map<AtomName, mongoose.Model<mongoose.Document<any>>>>();
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
	[k in ConnectionName]: Map<AtomName, mongoose.Model<mongoose.Document<any>>>
}

const mongo_app:MongoApp = {};

function get_model(conn_name:ConnectionName, atom_name:AtomName)
		:mongoose.Model<mongoose.Document<any>>{
	if(!mongo_app.connections){
		mongo_app.connections = {} as MongoConnections;
	}
	if(!mongo_app.connections[conn_name]){
		const mongo_conn_string = (core_config as any)[`mongo_${conn_name}_connection`];
		const mongo_db_string = (core_config as any)[`db_${conn_name}_name`];
		
		const conf_connection_name = (conn_name !== 'main' && typeof mongo_conn_string === 'string') ?
			mongo_conn_string : core_config.mongo_main_connection;
		const conf_db_name = (conn_name !== 'main' && typeof mongo_conn_string === 'string') ?
			mongo_db_string : core_config.db_main_name;
		
		mongo_app.connections[conn_name] = mongo_connection.create(
			conn_name,
			conf_connection_name,
			conf_db_name
		);
	}
	if(!mongo_app.models){
		mongo_app.models = {} as MongoModels;
	}
	if(!mongo_app.models[conn_name]){
		switch(conn_name){
			case 'main':{
				const undefined_connection_models = _create_models(mongo_app.connections.main);
				const main_connection_models = _create_models(mongo_app.connections.main, 'main');
				mongo_app.models.main = new Map<AtomName, mongoose.Model<mongoose.Document<any>>>(
					[...undefined_connection_models, ...main_connection_models]
				);
				break;
			}
			case 'log':{
				mongo_app.models.log = _create_models(mongo_app.connections.log, 'log');
				break;
			}
			case 'trash':{
				const model_by_atom_name = new Map<AtomName, mongoose.Model<mongoose.Document<any>>>();
				let atom_name:AtomName;
				for(atom_name in atom_book){
					const atom_def = atom_book[atom_name] as Book.BasicDefinition;
					if(atom_def.connection && atom_def.connection !== 'main'){
						continue;
					}
					const atom_schema_def = _convert_for_trash(generate_mongo_schema_def(atom_name));
					const atom_mongo_schema = new mongoose.Schema(atom_schema_def, { versionKey: false, strict: false });
					const atom_model = mongo_app.connections.trash.create_model(atom_name, atom_mongo_schema);
					model_by_atom_name.set(atom_name, atom_model);
				}
				mongo_app.models.trash = model_by_atom_name;
				break;
			}
		}
	}
	const model = mongo_app.models[conn_name].get(atom_name);
	if(!model){
		throw urn_exc.create(
			`NO_MODEL_FOUND`,
			`Cannot find model for atom [${atom_name}] in connection [${conn_name}]`
		);
	}
	return model;
}

export {get_model};


