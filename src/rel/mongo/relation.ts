/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_exception, urn_util} from 'uranio-utils';

import {schema} from '../../sch/server';

import {ConnectionName} from '../../typ/book_cln';

import * as conf from '../../conf/server';

import * as atm_keys from '../../atm/keys';

import * as atm_util from '../../atm/util';

import {Relation} from '../types';

import {PopulateObject} from './types';

import {get_model} from './models';

const urn_exc = urn_exception.init('REL_MONGO', 'Mongoose Relation');

/**
 * Mongoose Relation class
 */
@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class MongooseRelation<A extends schema.AtomName> implements Relation<A> {
	
	protected _conn_name:ConnectionName;
	
	protected _raw:mongoose.Model<mongoose.Document>;
	
	constructor(public atom_name:A) {
		
		this._conn_name = this._get_conn_name();
		
		// const models_map = models_by_connection.get(this._conn_name);
		// if(!models_map){
		//   const err_msg = `Cannot find models for connection [${this._conn_name}]`;
		//   throw urn_exc.create('MODELS_NOT_FOUND', err_msg);
		// }
		// const model = models_map.get(this.atom_name);
		// if(!model){
		//   let err_msg = `Cannot find model for atom [${this.atom_name}]`;
		//   err_msg += ` and connection [${this._conn_name}]`;
		//   throw urn_exc.create('MODEL_NOT_FOUND', err_msg);
		// }
		// this._raw = model;
		
		this._raw = get_model(this._conn_name, this.atom_name);
		
	}
	
	protected _get_conn_name():ConnectionName{
		return 'main';
	}
	
	public async select<D extends schema.Depth>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>[]>{
		// urn_log.trace(`Mongoose select - query, options`, query, options);
		let mon_find_res:schema.Molecule<A,D>[] = [];
		const sort = ((options?.sort) ? options.sort : {}) as {[k:string]: mongoose.SortOrder};
		if(options){
			if(options.depth && Number(options.depth) > 0){
				const populate_object = _generate_populate_obj(
					this.atom_name,
					Number(options.depth),
					options.depth_query
				);
				mon_find_res = await this._raw.find(query, null, options).sort(sort)
					.populate(populate_object).lean<schema.Molecule<A,D>[]>();
			}else{
				mon_find_res = await this._raw.find(query, null, options).sort(sort)
					.lean<schema.Molecule<A,D>[]>();
			}
		}else{
			mon_find_res = await this._raw.find(query).lean<schema.Molecule<A,D>[]>();
		}
		return mon_find_res.map((mon_doc:schema.Molecule<A,D>) => {
			return _clean_molecule<A,D>(this.atom_name, mon_doc);
		});
	}
	
	public async select_by_id<D extends schema.Depth>(id:string, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		// urn_log.trace(`Mongoose select_by_id - id, options`, id, options);
		let mon_find_by_id_res:schema.Molecule<A,D>;
		if(options && options.depth && Number(options.depth) > 0){
			const populate_object = _generate_populate_obj(
				this.atom_name,
				Number(options.depth),
				options.depth_query
			);
			mon_find_by_id_res = await this._raw.findById(id)
				.populate(populate_object).lean<schema.Molecule<A,D>>();
		}else{
			mon_find_by_id_res = await this._raw.findById(id).lean<schema.Molecule<A,D>>();
		}
		if(mon_find_by_id_res === null){
			throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
		}
		return _clean_molecule<A,D>(this.atom_name, mon_find_by_id_res);
	}
	
	public async select_one<D extends schema.Depth>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		// urn_log.trace(`Mongoose select_one - query, options`, query, options);
		let mon_find_one_res:schema.Molecule<A,D>;
		const sort = ((options?.sort) ? options.sort : {}) as {[k:string]: mongoose.SortOrder};
		if(options && options.depth && Number(options.depth) > 0){
			const populate_object = _generate_populate_obj(
				this.atom_name,
				Number(options.depth),
				options.depth_query
			);
			mon_find_one_res = await this._raw.findOne(query).sort(sort)
				.populate(populate_object).lean<schema.Molecule<A,D>>();
		}else{
			mon_find_one_res = await this._raw.findOne(query).sort(sort).lean<schema.Molecule<A,D>>();
		}
		if(mon_find_one_res === null){
			throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
		}
		return _clean_molecule<A,D>(this.atom_name, mon_find_one_res);
	}
	
	public async count(query:schema.Query<A>)
			:Promise<number>{
		const mon_count_res = await this._raw.countDocuments(query).lean<number>();
		return mon_count_res;
	}
	
	public async insert_one(atom_shape:schema.AtomShape<A>)
			:Promise<schema.Atom<A>>{
		if(urn_util.object.has_key(atom_shape, '_id')){
			delete (atom_shape as any)._id;
		}
		// urn_log.trace(`Mongoose insert_one - atom_shape`, atom_shape);
		const mon_model = new this._raw(atom_shape);
		const mon_res_doc = await mon_model.save();
		const str_id = mon_res_doc._id.toString();
		const mon_obj = mon_res_doc.toObject();
		mon_obj._id = str_id;
		return _clean_atom<A>(this.atom_name, mon_obj as schema.Atom<A>);
	}
	
	public async alter_by_id<D extends schema.Depth>(
		id:string,
		partial_atom:Partial<schema.AtomShape<A>>,
		options?:schema.Query.Options<A,D>
	):Promise<schema.Molecule<A,D>>{
		// urn_log.trace(`Mongoose alter_by_id - id, partial_atom, options`, id, partial_atom, options);
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot alter_by_id. Invalid id param.`;
			throw urn_exc.create_invalid_request('ALTER_BY_ID_INVALID_ID', err_msg);
		}
		const $unset = _find_unsets(this.atom_name, partial_atom);
		partial_atom = _clean_unset(this.atom_name, partial_atom);
		const update = {
			$set: partial_atom,
			$unset: $unset
		};
		const default_options:mongoose.QueryOptions = {new: true, lean: true};
		let current_options = default_options;
		let mon_update_res:schema.Molecule<A,D>;
		if(options){
			if(options.limit){
				delete options.limit;
			}
			current_options = {...default_options, ...options};
			if(options.depth && Number(options.depth) > 0){
				const populate_object = _generate_populate_obj(
					this.atom_name,
					Number(options.depth),
					options.depth_query
				);
				mon_update_res =
					await this._raw.findByIdAndUpdate({_id:id}, update, current_options)
						.populate(populate_object) as unknown as schema.Molecule<A,D>;
			}else{
				mon_update_res =
					await this._raw.findByIdAndUpdate({_id:id}, update, current_options) as unknown as schema.Molecule<A,D>;
			}
		}else{
			mon_update_res =
				await this._raw.findByIdAndUpdate({_id:id}, update, default_options) as unknown as schema.Molecule<A,D>;
		}
		if(mon_update_res === null){
			throw urn_exc.create_not_found('ALTER_BY_ID_NOT_FOUND', `Cannot alter_by_id. Record not found.`);
		}
		return _clean_molecule(this.atom_name, mon_update_res as schema.Molecule<A,D>);
	}
	
	public async replace_by_id(id:string, atom:schema.AtomShape<A>)
			:Promise<schema.Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot replace_by_id. Invalid id param.`;
			throw urn_exc.create('REPLACE_BY_ID_INVALID_ID', err_msg);
		}
		// urn_log.trace(`Mongoose replace_by_id id`, id);
		// urn_log.trace(`Mongoose replace_by_id atom`, atom);
		const mon_update_res =
			await this._raw.findByIdAndUpdate({_id:id}, atom, {new: true, lean: true, overwrite: true}) as unknown;
		if(mon_update_res === null){
			throw urn_exc.create_not_found('REPLACE_BY_ID_NOT_FOUND', `Cannot replace_by_id. Record not found.`);
		}
		const cleaned = _clean_atom(this.atom_name, mon_update_res as schema.Atom<A>);
		return cleaned;
	}
	
	public async delete_by_id(id:string)
			:Promise<schema.Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot delete_by_id. Invalid id param.`;
			throw urn_exc.create_invalid_request('DEL_BY_ID_INVALID_ID', err_msg);
		}
		// urn_log.trace(`Mongoose delete_by_id id`, id);
		const mon_delete_res =
			await this._raw.findOneAndDelete({_id:id});
		if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
			throw urn_exc.create_not_found('DEL_BY_ID_NOT_FOUND', `Cannot delete_by_id. Record not found.`);
		}
		return _clean_atom(this.atom_name, mon_delete_res.toObject() as schema.Atom<A>);
	}
	
	public async alter_multiple(ids:string[], partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>[]>{
		let delete_all = false;
		if(ids.length === 1 && ids[0] === '*'){
			delete_all = true;
		}
		if(delete_all === false){
			for(const id of ids){
				if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
					const err_msg = `Cannot alter_multiple. Invalid id.`;
					throw urn_exc.create_invalid_request('ALTER_MULTIPLE_INVALID_ID', err_msg);
				}
			}
		}
		const $unset = _find_unsets(this.atom_name, partial_atom);
		partial_atom = _clean_unset(this.atom_name, partial_atom);
		const update = {
			$set: partial_atom,
			$unset: $unset
		};
		// urn_log.trace(`Mongoose update_many ids`, ids);
		// urn_log.trace(`Mongoose update_many partial_atom`, partial_atom);
		const mongo_query_ids = (delete_all === true) ? {} : {_id: {$in: ids}};
		const mon_update_res = await this._raw.updateMany(
			mongo_query_ids,
			update,
			{new: true, lean: true}
		) as unknown; // Return a schema.Query with how many records were updated.
		if(mon_update_res === null){
			throw urn_exc.create_not_found('ALTER_MULTIPLE_ID_NOT_FOUND', `Cannot alter_multiple. Records not found.`);
		}
		return await this.select<0>(mongo_query_ids as schema.Query<A>);
	}
	
	public async insert_multiple(atom_shapes:schema.AtomShape<A>[], skip_on_error=false)
			:Promise<schema.Atom<A>[]>{
		const shapes_no_id:schema.AtomShape<A>[] = [];
		for(const atom_shape of atom_shapes){
			if(urn_util.object.has_key(atom_shape, '_id')){
				delete (atom_shape as any)._id;
			}
			shapes_no_id.push(atom_shape);
		}
		let mon_insert_many_res;
		
		// urn_log.trace(`Mongoose insert_many atom_shapes`, atom_shapes);
		try{
			mon_insert_many_res = await this._raw.insertMany(
				shapes_no_id, {
					lean: true,
					ordered: (!skip_on_error),
					// rawResult: (skip_on_error)
				}
			) as unknown;
			if(!Array.isArray(mon_insert_many_res)){
				throw urn_exc.create('INSERT_MULTIPLE_FAILED', `Cannot insert_multiple.`);
			}
		}catch(err){
			const anyerr = err as any;
			if(!Array.isArray(anyerr.insertedDocs) || !Array.isArray(anyerr.result?.result?.writeErrors)){
				throw anyerr;
			}
			// console.log(JSON.stringify(err, undefined, 2));
			const debug_info = `Insert multiple [${this.atom_name}]`;
			for(const e of anyerr.result.result.writeErrors){
				let warn_msg = '';
				warn_msg += `${debug_info} SKIPPING`;
				warn_msg += ` [${e.code}] ${e.errmsg}`;
				urn_log.warn(warn_msg);
			}
			
			let debug_original = `${debug_info}`;
			debug_original += ` # Original documents: ${atom_shapes.length}`;
			urn_log.debug(debug_original);
			
			let debug_warn = `${debug_info}`;
			debug_warn += ` # Documents skipped: ${anyerr.result?.result?.writeErrors?.length || 0}`;
			urn_log.warn(debug_warn);
			
			let debug_insert = `${debug_info}`;
			debug_insert += ` # Documents inserted: ${anyerr.result?.result?.nInserted || 0}`;
			urn_log.debug(debug_insert);
			
			mon_insert_many_res = anyerr.insertedDocs;
		}
		
		const string_id_atoms:schema.Atom<A>[] = [];
		for(const db_atom of mon_insert_many_res){
			const clean_atom = {
				...db_atom.toObject()
			};
			clean_atom._id = db_atom._id.toString();
			string_id_atoms.push(clean_atom);
		}
		return _clean_atoms<A>(this.atom_name, string_id_atoms as schema.Atom<A>[]);
	}
	
	public async delete_multiple(ids:string[]):Promise<schema.Atom<A>[]>{
		let delete_all = false;
		if(ids.length === 1 && ids[0] === '*'){
			delete_all = true;
		}
		if(delete_all === false){
			for(const id of ids){
				if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
					const err_msg = `Cannot delete_by_id. Invalid id param.`;
					throw urn_exc.create_invalid_request('DEL_BY_ID_INVALID_ID', err_msg);
				}
			}
		}
		// urn_log.trace(`Mongoose delete_multiple ids`, ids);
		const mongo_query = (delete_all === true) ? {} : {_id: {$in: ids}};
		const almost_deleted_docs = await this.select<0>(mongo_query as schema.Query<A>);
		// Return a schema.Query with how many records were deleted.
		const mon_delete_res = await this._raw.deleteMany(mongo_query);
		if(mon_delete_res === null){
			throw urn_exc.create_not_found('DEL_MULTIPLE_NOT_FOUND', `Cannot delete_multiple.`);
		}
		// const cleaned_atoms:schema.Atom<A>[] = [];
		// for(const db_atom of mon_delete_res){
		//   cleaned_atoms.push(_clean_atom(this.atom_name, db_atom.toObject() as schema.Atom<A>));
		// }
		// return cleaned_atoms;
		return almost_deleted_docs;
	}
	
	public is_valid_id(id:string)
		:boolean{
		return _is_valid_id(id);
	}
	
}

function _is_valid_id(id:string)
		:boolean{
	return mongoose.Types.ObjectId.isValid(id);
}

type Unset = {
	[k:string]: 1
}

function _find_unsets<A extends schema.AtomName>(atom_name:A, partial_atom:Partial<schema.AtomShape<A>>){
	const unsets = {} as Unset;
	const type_atom_props = atm_keys.get_bond(atom_name);
	for(const [prop, value] of Object.entries(partial_atom)){
		if(type_atom_props.has(prop as keyof Partial<schema.AtomShape<A>>) && value === ''){
			unsets[prop] = 1;
		}
	}
	return unsets;
}

function _clean_unset<A extends schema.AtomName>(atom_name:A, partial_atom:Partial<schema.AtomShape<A>>){
	const type_atom_props = atm_keys.get_bond(atom_name);
	for(const [prop, value] of Object.entries(partial_atom)){
		if(type_atom_props.has(prop as keyof Partial<schema.AtomShape<A>>) && value === ''){
			delete partial_atom[prop as keyof Partial<schema.AtomShape<A>>];
		}
	}
	return partial_atom;
}

function _generate_subatomkey_populate_obj<A extends schema.AtomName>(
	atom_name:A,
	subatom_key:string,
	depth:number,
	depth_query?:schema.Query<A>
):PopulateObject{
	const subatom_name = atm_util.get_subatom_name(atom_name, subatom_key);
	let populate_object:PopulateObject = {path: subatom_key, model: subatom_name};
	if(depth_query){
		populate_object.match = depth_query;
	}
	const subsubatom_keys = atm_keys.get_bond(subatom_name);
	if(subsubatom_keys.size === 0 || depth == 0)
		return populate_object;
	const subpops:PopulateObject[] = [];
	for(const subsubkey of subsubatom_keys){
		subpops.push(
			_generate_subatomkey_populate_obj(subatom_name, subsubkey, depth - 1, depth_query)
		);
	}
	populate_object = {
		...populate_object,
		populate: subpops
	};
	return populate_object;
}

function _generate_populate_obj<A extends schema.AtomName>(atom_name:A, depth?:number, depth_query?:schema.Query<A>)
		:PopulateObject[]{
	const subatom_keys = atm_keys.get_bond(atom_name);
	const populate_object = [];
	if(depth && depth > 0 && depth <= conf.get(`max_query_depth_allowed`) && subatom_keys.size){
		for(const k of subatom_keys){
			populate_object.push(
				_generate_subatomkey_populate_obj(atom_name, k as string, depth - 1, depth_query)
			);
		}
	}
	return populate_object;
}
	
function _clean_atoms<A extends schema.AtomName>(atom_name:A, atoms:schema.Atom<A>[]):schema.Atom<A>[]{
	const cleaned_atoms:schema.Atom<A>[] = [];
	for(const atom of atoms){
		cleaned_atoms.push(_clean_atom(atom_name, atom));
	}
	return cleaned_atoms;
}

function _clean_atom<A extends schema.AtomName>(atom_name:A, atom:schema.Atom<A>)
		:schema.Atom<A>{
	if(atom._id){
		atom._id = atom._id.toString();
	}
	if(urn_util.object.has_key(atom,'__v')){
		delete (atom as any).__v;
	}
	const subatom_keys = atm_keys.get_bond<A>(atom_name) as Set<keyof schema.Atom<A>>;
	if(subatom_keys.size > 0){
		for(const subkey of subatom_keys){
			const subatom_name = atm_util.get_subatom_name<A>(atom_name, subkey as string);
			const prop = atom[subkey];
			if(atom[subkey]){
				if(Array.isArray(prop)){
					for(let i = 0; i < prop.length; i++){
						if(_is_valid_id(prop[i] as string)){
							prop[i] = (prop[i] as any).toString();
						}else if(typeof prop[i] === 'object'){
							prop[i] = _clean_molecule(subatom_name, prop[i] as any) as any;
						}
					}
				}else if(_is_valid_id(prop as unknown as string)){
					atom[subkey] = String(prop) as any;
				}else if(typeof prop === 'object'){
					atom[subkey] = _clean_molecule(subatom_name, prop as any) as any;
				}
			}
		}
	}
	return atom;
}

function _clean_molecule<A extends schema.AtomName, D extends schema.Depth>(atom_name:A, molecule:schema.Molecule<A,D>)
		:schema.Molecule<A,D>{
	if(molecule._id){
		molecule._id = molecule._id.toString();
	}
	if(urn_util.object.has_key(molecule,'__v')){
		delete (molecule as any).__v;
	}
	const subatom_keys = atm_keys.get_bond<A>(atom_name) as Set<keyof schema.Molecule<A,D>>;
	if(subatom_keys.size > 0){
		for(const subkey of subatom_keys){
			const subatom_name = atm_util.get_subatom_name<A>(atom_name, subkey as string);
			const prop = molecule[subkey];
			if(prop){
				if(Array.isArray(prop)){
					for(let i = 0; i < prop.length; i++){
						if(_is_valid_id(prop[i] as any as string)){
							prop[i] = (prop[i] as any).toString();
						}else if(typeof prop[i] === 'object'){
							prop[i] = _clean_molecule(subatom_name, prop[i] as any) as any;
						}
					}
				}else if(_is_valid_id(prop as unknown as string)){
					molecule[subkey] = String(prop) as any;
				}else if(typeof prop === 'object'){
					molecule[subkey] = _clean_molecule(subatom_name, prop as any) as any;
				}
			}
		}
	}
	return molecule;
}

export function create<A extends schema.AtomName>(atom_name: A)
		:MongooseRelation<A>{
	
	urn_log.trace(`Create MongooseRelation`);
	
	return new MongooseRelation<A>(atom_name);
}

