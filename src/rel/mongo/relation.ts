/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import {
	Query,
	AtomName,
	Atom,
	AtomShape,
	Depth,
	Molecule
} from '../../types';

import {Relation} from '../types';

import {generate_mongo_schema_def} from './schema';

import * as mongo_connection from './connection';

import * as urn_atm from '../../atm/';

import {core_config} from '../../config/defaults';

const mongo_main_conn = mongo_connection.create(
	'main',
	core_config.db_host,
	core_config.db_port,
	core_config.db_name
);

const urn_exc = urn_exception.init('REL_MONGO', 'Mongoose Relation');

type PopulateObject = {
	path: string,
	model: string,
	populate?: PopulateObject[]
}

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
	
	private _generate_populate_object<A extends AtomName>(atom_name:A, subatom_key:string, depth:number)
				:PopulateObject{
		const subatom_name = urn_atm.get_subatom_name(atom_name, subatom_key);
		const path_model:PopulateObject = {path: subatom_key, model: subatom_name};
		const subsubatom_keys = urn_atm.get_subatom_keys(subatom_name);
		if(subsubatom_keys.size === 0 || depth == 0)
			return path_model;
		const subpops:PopulateObject[] = [];
		for(const subsubkey of subsubatom_keys){
			subpops.push(this._generate_populate_object(subatom_name, subsubkey, depth - 1));
		}
		const populate_object:PopulateObject = {
			...path_model,
			populate: subpops
		};
		return populate_object;
	}
	
	public async select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		// TODO implement DEPTH
		let mon_find_res:Molecule<A,D>[] = [];
		if(options){
			const subatom_keys = urn_atm.get_subatom_keys(this.atom_name);
			const populate_object = [];
			if(options.depth && options.depth > 0 && options.depth < core_config.max_query_depth_allowed && subatom_keys.size){
				for(const k of subatom_keys){
					populate_object.push(this._generate_populate_object(this.atom_name, k as string, (options.depth as number) - 1));
				}
				mon_find_res = await this._raw.find(query, null, options)
					.populate(populate_object).lean<Molecule<A,D>[]>();
			}else{
				mon_find_res = await this._raw.find(query, null, options).lean<Molecule<A,D>[]>();
			}
		}else{
			mon_find_res = await this._raw.find(query).lean<Molecule<A,D>[]>();
		}
		return mon_find_res.map((mon_doc:Molecule<A,D>) => {
			// return _clean_object(mon_doc);
			return _clean_element(mon_doc);
		});
	}
	
	public async select_by_id<D extends Depth>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		
		// TODO implement DEPTH
		
		console.log(depth);
		
		const mon_find_by_id_res = await this._raw.findById(id).lean<Molecule<A,D>>();
		if(mon_find_by_id_res === null){
			throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
		}
		// return _clean_object(mon_find_by_id_res as Atom<A>);
		return _clean_element(mon_find_by_id_res as Molecule<A,D>);
	}
	
	public async select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		const mon_find_one_res = (typeof options !== 'undefined' && options.sort) ?
			await this._raw.findOne(query).sort(options.sort).lean<Molecule<A,D>>() :
			await this._raw.findOne(query).lean<Molecule<A,D>>();
		if(mon_find_one_res === null){
			throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
		}
		// return _clean_object(mon_find_one_res as Atom<A>);
		return _clean_element(mon_find_one_res as Molecule<A,D>);
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		if(urn_util.object.has_key(atom_shape, '_id')){
			delete (atom_shape as any)._id;
		}
		const mon_model = new this._raw(atom_shape);
		const mon_res_doc = await mon_model.save();
		const str_id = mon_res_doc._id.toString();
		const mon_obj = mon_res_doc.toObject();
		mon_obj._id = str_id;
		return mon_obj as Atom<A>;
	}
	
	// public async alter_one(atom:Atom<A>)
	//     :Promise<Atom<A>>{
	//   return await this.alter_by_id(atom._id, atom);
	//   // if(!urn_util.object.has_key(atom, '_id')){
	//   //   const err_msg = `Cannot alter_one. Argument has no _id.`;
	//   //   throw urn_exc.create('ALTER_ONE_NO_ID', err_msg);
	//   // }
	//   // if(typeof atom._id !== 'string' || atom._id === '' || !this.is_valid_id(atom._id)){
	//   //   const err_msg = `Cannot alter_one. Argument has invalid _id.`;
	//   //   throw urn_exc.create('ALTER_ONE_INVALID_ID', err_msg);
	//   // }
	//   // const mon_update_res =
	//   //   await this._raw.findOneAndUpdate({_id:atom._id}, atom, {new: true, lean: true});
	//   // if(mon_update_res === null){
	//   //   throw urn_exc.create('ALTER_ONE_NOT_FOUND', `Cannot alter_one. Record not found.`);
	//   // }
	//   // return _clean_object(mon_update_res as Atom<A>);
	//   // // const mon_obj = mon_update_res.toObject();
	//   // // return _clean_object(mon_obj);
	// }
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot alter_by_id. Invalid id param.`;
			throw urn_exc.create('ALTER_BY_ID_INVALID_ID', err_msg);
		}
		const mon_update_res =
			await this._raw.findByIdAndUpdate({_id:id}, partial_atom, {new: true, lean: true}) as unknown;
		if(mon_update_res === null){
			throw urn_exc.create('ALTER_BY_ID_NOT_FOUND', `Cannot alter_by_id. Record not found.`);
		}
		return _clean_object(mon_update_res as Atom<A>);
		// const mon_obj = mon_update_res.toObject();
		// return _clean_object(mon_obj);
	}
	
	public async replace_by_id(id:string, atom:AtomShape<A>)
			:Promise<Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot replace_by_id. Invalid id param.`;
			throw urn_exc.create('REPLACE_BY_ID_INVALID_ID', err_msg);
		}
		const mon_update_res =
			await this._raw.findByIdAndUpdate({_id:id}, atom, {new: true, lean: true, overwrite: true}) as unknown;
		if(mon_update_res === null){
			throw urn_exc.create('REPLACE_BY_ID_NOT_FOUND', `Cannot replace_by_id. Record not found.`);
		}
		return _clean_object(mon_update_res as Atom<A>);
		// const mon_obj = mon_update_res.toObject();
		// return _clean_object(mon_obj);
	}
	
	// public async delete_one(atom:Atom<A>)
	//     :Promise<Atom<A>>{
	//   return await this.delete_by_id(atom._id);
	//   // if(!urn_util.object.has_key(atom, '_id')){
	//   //   const err_msg = `Cannot delete_one. Argument has no _id.`;
	//   //   throw urn_exc.create('DEL_ONE_NO_ID', err_msg);
	//   // }
	//   // if(typeof atom._id !== 'string' || atom._id === '' || !this.is_valid_id(atom._id)){
	//   //   const err_msg = `Cannot delete_one. Argument has invalid _id.`;
	//   //   throw urn_exc.create('DEL_ONE_INVALID_ID', err_msg);
	//   // }
	//   // const mon_delete_res =
	//   //   await this._raw.findOneAndDelete({_id:atom._id});
	//   // if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
	//   //   throw urn_exc.create_not_found('DEL_ONE_NOT_FOUND', `Cannot delete_one. Record not found.`);
	//   // }
	//   // return _clean_object(mon_delete_res.toObject() as Atom<A>);
	// }
	
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

function _clean_object<A extends AtomName>(atom:Atom<A>)
		:Atom<A>{
	if(urn_util.object.has_key(atom,'_id')){
		atom._id = atom._id.toString();
	}
	if(urn_util.object.has_key(atom,'__v')){
		delete (atom as any).__v;
	}
	return atom;
}

function _clean_element<A extends AtomName, D extends Depth>(atom:Molecule<A,D>)
		:Molecule<A,D>{
		
	// TODO implement
		
	// if(urn_util.object.has_key(atom,'_id')){
	//   atom._id = atom._id.toString();
	// }
	// if(urn_util.object.has_key(atom,'__v')){
	//   delete (atom as any).__v;
	// }
	return atom;
}

const already_initialized:AtomName[] = [];

function _create_dependency_relations<A extends AtomName>(atom_name:A){
	
	urn_log.fn_debug(`Create Dependency MongooseRelations`);
	
	const subatom_keys = urn_atm.get_subatom_keys(atom_name);
	for(const k of subatom_keys){
		const subatom_name = urn_atm.get_subatom_name(atom_name, k as string);
		if(!already_initialized.includes(subatom_name)){
			create(subatom_name);
		}
	}
}

export function create<A extends AtomName>(atom_name: A)
		:MongooseRelation<A>{
	
	urn_log.fn_debug(`Create MongooseRelation`);
	
	_create_dependency_relations(atom_name);
	return new MongooseRelation<A>(atom_name);
}

