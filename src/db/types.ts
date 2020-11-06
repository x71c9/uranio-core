/**
 * Types for DB module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import urn_mdls from 'urn-mdls';

import {QueryFilter, QueryOptions} from '../types';

export class Relation<M> extends mongoose.Model{
	
	public async find(filter:QueryFilter<M>, options?:QueryOptions<M>)
			:Promise<urn_mdls.resources.Resource[]>{
		console.log('FINDDDD');
		const mon_find_res = (options) ? await super.find(filter, null, options).lean() : await super.find(filter).lean();
		return mon_find_res.map((mon_doc:mongoose.Document) => {
			console.log(mon_doc);
			console.log(typeof mon_doc._id);
			mon_doc._id = mon_doc._id.toString();
			console.log(typeof mon_doc._id);
			return mon_doc;
		});
	}
	
}

export class Schema extends mongoose.Schema{}

export interface SchemaDefinition extends mongoose.SchemaDefinition{}
