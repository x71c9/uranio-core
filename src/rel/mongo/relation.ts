/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import {FilterType, QueryOptions, AtomName, Atom, AtomShape} from '../../types';

import {Relation} from '../types';

import {generate_mongo_schema_def} from './schema';

import * as mongo_connection from './connection';

// import * as urn_atm from '../../atm/';

import {core_config} from '../../config/defaults';

const mongo_main_conn = mongo_connection.create(
	'main',
	core_config.db_host,
	core_config.db_port,
	core_config.db_name
);

const urn_exc = urn_exception.init('REL_M', 'Mongoose Relation');

/**
 * Mongoose Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class MongooseRelation<A extends AtomName> implements Relation<A> {
	
	protected _conn:mongo_connection.ConnectionInstance;
	
	protected _raw:mongoose.Model<mongoose.Document>;
	
	protected _mongo_schema_def:mongoose.SchemaDefinition;
	
	constructor(public atom_name:A) {
		
		this._conn = this._get_connection();
		
		this._mongo_schema_def = generate_mongo_schema_def<A>(this.atom_name);
		
		this._raw = this._complie_mongoose_model();
		
	}
	
	protected _get_connection():mongo_connection.ConnectionInstance{
		return mongo_main_conn;
	}
	
	protected _complie_mongoose_model():mongoose.Model<mongoose.Document>{
		const mongo_schema = new mongoose.Schema(this._mongo_schema_def, { versionKey: false });
		return this._conn.get_model(this.atom_name, mongo_schema);
	}
	
	public async select(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Atom<A>[]>{
		const mon_find_res = (options) ?
			await this._raw.find(filter, null, options).lean<Atom<A>>():
			await this._raw.find(filter).lean<Atom<A>>();
		return mon_find_res.map((mon_doc:Atom<A>) => {
			return _clean_object(mon_doc);
		});
	}
	
	public async select_by_id(id:string)
			:Promise<Atom<A>>{
		const mon_find_by_id_res = await this._raw.findById(id).lean<Atom<A>>();
		if(mon_find_by_id_res === null){
			throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
		}
		return _clean_object(mon_find_by_id_res);
	}
	
	public async select_one(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Atom<A>>{
		const mon_find_one_res = (typeof options !== 'undefined' && options.sort) ?
			await this._raw.findOne(filter).sort(options.sort).lean<Atom<A>>() :
			await this._raw.findOne(filter).lean<Atom<A>>();
		if(mon_find_one_res === null){
			throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
		}
		return _clean_object(mon_find_one_res);
	}
	
	public async insert_one(resource:AtomShape<A>)
			:Promise<Atom<A>>{
		if(urn_util.object.has_key(resource, '_id')){
			delete (resource as any)._id;
		}
		const mon_model = new this._raw(resource);
		const mon_res_doc = await mon_model.save();
		const str_id = mon_res_doc._id.toString();
		const mon_obj = mon_res_doc.toObject();
		mon_obj._id = str_id;
		return mon_obj;
	}
	
	public async alter_one(resource:Atom<A>)
			:Promise<Atom<A>>{
		return await this.alter_by_id(resource._id, resource);
		// if(!urn_util.object.has_key(resource, '_id')){
		//   const err_msg = `Cannot alter_one. Argument has no _id.`;
		//   throw urn_exc.create('ALTER_ONE_NO_ID', err_msg);
		// }
		// if(typeof resource._id !== 'string' || resource._id === '' || !this.is_valid_id(resource._id)){
		//   const err_msg = `Cannot alter_one. Argument has invalid _id.`;
		//   throw urn_exc.create('ALTER_ONE_INVALID_ID', err_msg);
		// }
		// const mon_update_res =
		//   await this._raw.findOneAndUpdate({_id:resource._id}, resource, {new: true, lean: true});
		// if(mon_update_res === null){
		//   throw urn_exc.create('ALTER_ONE_NOT_FOUND', `Cannot alter_one. Record not found.`);
		// }
		// return _clean_object(mon_update_res as Atom<A>);
		// // const mon_obj = mon_update_res.toObject();
		// // return _clean_object(mon_obj);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot alter_by_id. Invalid id param.`;
			throw urn_exc.create('ALTER_BY_ID_INVALID_ID', err_msg);
		}
		const mon_update_res =
			await this._raw.findOneAndUpdate({_id:id}, partial_atom, {new: true, lean: true});
		if(mon_update_res === null){
			throw urn_exc.create('ALTER_BY_ID_NOT_FOUND', `Cannot alter_by_id. Record not found.`);
		}
		return _clean_object(mon_update_res as Atom<A>);
		// const mon_obj = mon_update_res.toObject();
		// return _clean_object(mon_obj);
	}
	
	public async delete_one(resource:Atom<A>)
			:Promise<Atom<A>>{
		return await this.delete_by_id(resource._id);
		// if(!urn_util.object.has_key(resource, '_id')){
		//   const err_msg = `Cannot delete_one. Argument has no _id.`;
		//   throw urn_exc.create('DEL_ONE_NO_ID', err_msg);
		// }
		// if(typeof resource._id !== 'string' || resource._id === '' || !this.is_valid_id(resource._id)){
		//   const err_msg = `Cannot delete_one. Argument has invalid _id.`;
		//   throw urn_exc.create('DEL_ONE_INVALID_ID', err_msg);
		// }
		// const mon_delete_res =
		//   await this._raw.findOneAndDelete({_id:resource._id});
		// if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
		//   throw urn_exc.create_not_found('DEL_ONE_NOT_FOUND', `Cannot delete_one. Record not found.`);
		// }
		// return _clean_object(mon_delete_res.toObject() as Atom<A>);
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot delete_by_id. Invalid id param.`;
			throw urn_exc.create('DEL_BY_ID_INVALID_ID', err_msg);
		}
		const mon_delete_res =
			await this._raw.findOneAndDelete({_id:id});
		if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
			throw urn_exc.create_not_found('DEL_BY_ID_NOT_FOUND', `Cannot delete_by_id. Record not found.`);
		}
		return _clean_object(mon_delete_res.toObject() as Atom<A>);
	}
	
	public is_valid_id(id:string)
		:boolean{
		return this._conn.is_valid_id(id);
	}
	
}

function _clean_object<A extends AtomName>(resource:Atom<A>)
		:Atom<A>{
	if(urn_util.object.has_key(resource,'_id')){
		resource._id = resource._id.toString();
	}
	if(urn_util.object.has_key(resource,'__v')){
		delete (resource as any).__v;
	}
	return resource;
}

export function create<A extends AtomName>(atom_name: A)
		:MongooseRelation<A>{
	urn_log.fn_debug(`Create MongooseRelation`);
	return new MongooseRelation<A>(atom_name);
}

