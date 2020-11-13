/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_error} from 'urn-lib';

import {RelationName, QueryFilter, QueryOptions} from '../../types';

import {Relation} from '../types';

import * as mongo_connection from './connection';

import {mongo_schemas} from './schemas/';

import * as urn_atm from '../../atm/';

const mongo_conn = mongo_connection.create(
	'main',
	process.env.urn_db_host!,
	parseInt(process.env.urn_db_port!),
	process.env.urn_db_name!
);

/**
 * Mongoose Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class MongooseRelation<M extends urn_atm.models.Resource> implements Relation<M>{
	
	protected _conn:mongo_connection.ConnectionInstance;
	
	protected _raw:mongoose.Model<mongoose.Document>;
	
	constructor(public relation_name:RelationName, connection?:mongo_connection.ConnectionInstance){
		
		this._conn = (connection) ? connection : mongo_conn;
		
		this._raw = this._conn.get_model(relation_name, mongo_schemas[relation_name]);
		
	}
	
	public async find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<M[]>{
		try{
			const mon_find_res = (options) ?
				await this._raw.find(filter, null, options).lean<M>():
				await this._raw.find(filter).lean<M>();
			return mon_find_res.map((mon_doc:M) => {
				return string_id(mon_doc);
			});
		}catch(err){
			throw urn_error.create(`Mongoose Relation.find ERROR.`);
		}
	}
	
	public async find_by_id(id:string)
			:Promise<M | null>{
		const mon_find_by_id_res = await this._raw.findById(id).lean<M>();
		if(mon_find_by_id_res === null){
			return null;
		}
		return string_id(mon_find_by_id_res);
	}
	
	public async find_one(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<M | null>{
		const mon_find_one_res = (typeof options !== 'undefined' && options.sort) ?
			await this._raw.findOne(filter).sort(options.sort).lean<M>() :
			await this._raw.findOne(filter).lean<M>();
		if(mon_find_one_res === null){
			return null;
		}
		return string_id(mon_find_one_res);
	}
	
	public async insert_one(resource:M)
			:Promise<M>{
		if(Object.prototype.hasOwnProperty.call(resource, '_id')){
			delete resource._id;
		}
		try{
			const mon_model = new this._raw(resource);
			const mon_res_doc = await mon_model.save();
			const str_id = mon_res_doc._id.toString();
			const mon_obj = mon_res_doc.toObject();
			mon_obj._id = str_id;
			return mon_obj;
		}catch(err){
			let err_msg = `Mongoose Relation insert_one() failed. Cannot insert Model.`;
			err_msg += ` ${err.message}`;
			throw urn_error.create(err_msg, err);
		}
	}
	
	public async update_one(resource:M)
			:Promise<M | null>{
		try{
			if(!Object.prototype.hasOwnProperty.call(resource, '_id') ||
					typeof resource._id !== 'string' ||
					resource._id === ''){
				throw urn_error.create(`Cannot update. Model has no _id`);
			}
			const mon_update_res =
				await this._raw.findOneAndUpdate({_id:resource._id}, resource, {new: true, lean: true});
			if(mon_update_res === null){
				return null;
			}
			return string_id(mon_update_res as M);
			// const mon_obj = mon_update_res.toObject();
			// return string_id(mon_obj);
		}catch(err){
			let err_msg = `Mongoose Relation update_one() failed. Cannot update Model.`;
			err_msg += ` ${err.message}`;
			throw urn_error.create(err_msg, err);
		}
	}
	
	public async delete_one(resource:M)
			:Promise<M | null>{
		try{
			if(!Object.prototype.hasOwnProperty.call(resource, '_id') ||
					typeof resource._id !== 'string' ||
					resource._id === ''){
				throw urn_error.create(`Cannot delete. Model has no _id`);
			}
			const mon_delete_res =
				await this._raw.findOneAndDelete({_id:resource._id});
			if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
				return null;
			}
			return string_id(mon_delete_res.toObject() as M);
		}catch(err){
			let err_msg = `Mongoose Relation delete() failed. Cannot delete Model.`;
			err_msg += ` ${err.message}`;
			throw urn_error.create(err_msg, err);
		}
	}
	
	public is_valid_id(id:string)
		:boolean{
		return this._conn.is_valid_id(id);
	}
	
}

function string_id<M extends urn_atm.models.Resource>(resource:M)
		:M{
	if(resource._id){
		resource._id = resource._id.toString();
	}
	return resource;
}


