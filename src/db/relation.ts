/**
 * DB Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import urn_mdls from 'urn-mdls';

import {urn_log, urn_error} from 'urn-lib';

import {QueryFilter, QueryOptions} from '../types';

/**
 * Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class Relation<M extends urn_mdls.resources.Resource> {
	
	constructor(private _raw:mongoose.Model<mongoose.Document>){}
	
	public async find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<M[]>{
		const mon_find_res = (options) ?
			await this._raw.find(filter, null, options).lean<M>():
			await this._raw.find(filter).lean<M>();
		return mon_find_res.map((mon_doc:M) => {
			if(mon_doc._id)
				mon_doc._id = mon_doc._id.toString();
			return mon_doc;
		});
	}
	
	public async find_by_id(id:string)
			:Promise<M | null>{
		const mon_find_by_id_res = await this._raw.findById(id).lean<M>();
		if(mon_find_by_id_res === null){
			return null;
		}
		if(mon_find_by_id_res._id){
			mon_find_by_id_res._id = mon_find_by_id_res._id.toString();
		}
		return mon_find_by_id_res;
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
			throw urn_error.create(`Relation insert_one() failed. Cannot insert Model. ${err.message}`, err);
		}
	}
	
}

