/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import {FilterType, QueryOptions, AtomName, Grain} from '../../types';

import {Relation} from '../types';

import * as mongo_connection from './connection';

// import {mongo_schemas} from './schemas/';

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
	
	constructor(public relation_name:A, protected _mongo_schema:mongoose.SchemaDefinition){
		
		this._conn = this._get_connection();
		
		this._raw = this._complie_mongoose_model();
		
	}
	
	protected _get_connection():mongo_connection.ConnectionInstance{
		return mongo_main_conn;
	}
	
	protected _complie_mongoose_model():mongoose.Model<mongoose.Document>{
		const mongo_schema = new mongoose.Schema(this._mongo_schema);
		return this._conn.get_model(this.relation_name, mongo_schema);
	}
	
	public async select(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Grain<A>[]>{
		const mon_find_res = (options) ?
			await this._raw.find(filter, null, options).lean<Grain<A>>():
			await this._raw.find(filter).lean<Grain<A>>();
		return mon_find_res.map((mon_doc:Grain<A>) => {
			return string_id(mon_doc);
		});
	}
	
	public async select_by_id(id:string)
			:Promise<Grain<A>>{
		const mon_find_by_id_res = await this._raw.findById(id).lean<Grain<A>>();
		if(mon_find_by_id_res === null){
			throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
		}
		return string_id(mon_find_by_id_res);
	}
	
	public async select_one(filter:FilterType<A>, options?:QueryOptions<A>)
			:Promise<Grain<A>>{
		const mon_find_one_res = (typeof options !== 'undefined' && options.sort) ?
			await this._raw.findOne(filter).sort(options.sort).lean<Grain<A>>() :
			await this._raw.findOne(filter).lean<Grain<A>>();
		if(mon_find_one_res === null){
			throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
		}
		return string_id(mon_find_one_res);
	}
	
	public async insert_one(resource:Grain<A>)
			:Promise<Grain<A>>{
		if(urn_util.object.has_key(resource, '_id')){
			delete resource._id;
		}
		const mon_model = new this._raw(resource);
		const mon_res_doc = await mon_model.save();
		const str_id = mon_res_doc._id.toString();
		const mon_obj = mon_res_doc.toObject();
		mon_obj._id = str_id;
		return mon_obj;
	}
	
	public async alter_one(resource:Grain<A>)
			:Promise<Grain<A>>{
		if(!urn_util.object.has_key(resource, '_id')){
			const err_msg = `Cannot alter_one. Argument has no _id.`;
			throw urn_exc.create('UPD_ONE_NO_ID', err_msg);
		}
		if(typeof resource._id !== 'string' || resource._id === '' || !this.is_valid_id(resource._id)){
			const err_msg = `Cannot alter_one. Argument has invalid _id.`;
			throw urn_exc.create('UPD_ONE_INVALID_ID', err_msg);
		}
		const mon_update_res =
			await this._raw.findOneAndUpdate({_id:resource._id}, resource, {new: true, lean: true});
		if(mon_update_res === null){
			throw urn_exc.create('UPD_ONE_NOT_FOUND', `Cannot alter_one. Record not found.`);
		}
		return string_id(mon_update_res as Grain<A>);
		// const mon_obj = mon_update_res.toObject();
		// return string_id(mon_obj);
	}
	
	public async delete_one(resource:Grain<A>)
			:Promise<Grain<A>>{
		if(!urn_util.object.has_key(resource, '_id')){
			const err_msg = `Cannot delete_one. Argument has no _id.`;
			throw urn_exc.create('DEL_ONE_NO_ID', err_msg);
		}
		if(typeof resource._id !== 'string' || resource._id === '' || !this.is_valid_id(resource._id)){
			const err_msg = `Cannot delete_one. Argument has invalid _id.`;
			throw urn_exc.create('DEL_ONE_INVALID_ID', err_msg);
		}
		const mon_delete_res =
			await this._raw.findOneAndDelete({_id:resource._id});
		if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
			throw urn_exc.create_not_found('DEL_ONE_NOT_FOUND', `Cannot delete_one. Record not found.`);
		}
		return string_id(mon_delete_res.toObject() as Grain<A>);
	}
	
	public is_valid_id(id:string)
		:boolean{
		return this._conn.is_valid_id(id);
	}
	
}

function string_id<A extends AtomName>(resource:Grain<A>)
		:Grain<A>{
	if(resource._id){
		resource._id = resource._id.toString();
	}
	return resource;
}

export function create<A extends AtomName>(relation_name: A, _mongo_schema:mongoose.SchemaDefinition)
		:MongooseRelation<A>{
	urn_log.fn_debug(`Create MongooseRelation`);
	return new MongooseRelation<A>(relation_name, _mongo_schema);
}

