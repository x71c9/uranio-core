/**
 * DB Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import urn_mdls from 'urn-mdls';

import {QueryFilter, QueryOptions} from '../types';

/**
 * Relation class
 */
export class Relation<M extends urn_mdls.resources.Resource> {
	
	constructor(private _raw:InstanceType<typeof mongoose.Model>){}
	
	public async find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<M[]>{
		const mon_find_res = (options) ?
			await this._raw.find(filter, null, options).lean() :
			await this._raw.find(filter).lean();
		return mon_find_res.map((mon_doc:mongoose.Document) => {
			mon_doc._id = mon_doc._id.toString();
			return mon_doc;
		});
	}
	
	public async insert_one(resource:M)
			:Promise<M>{
		const mon_doc = new this._raw(resource);
		const mon_res_doc = await mon_doc.save();
		const str_id = mon_res_doc._id.toString();
		const mon_obj = mon_res_doc.toObject();
		mon_obj._id = str_id;
		return mon_obj;
	}
	
}

