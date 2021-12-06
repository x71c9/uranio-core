/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import {
	AtomName,
	Atom,
	AtomShape,
	Depth,
	Molecule,
} from '../../typ/atom';

import {Query} from '../../typ/query';

import {ConnectionName} from '../../typ/book_cln';

import {core_config} from '../../cnf/defaults';

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
export class MongooseRelation<A extends AtomName> implements Relation<A> {
	
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
	
	public async select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		let mon_find_res:Molecule<A,D>[] = [];
		if(options){
			if(options.depth && typeof options.depth === 'number' && options.depth > 0){
				const populate_object = _generate_populate_obj(
					this.atom_name,
					options.depth,
					options.depth_query
				);
				mon_find_res = await this._raw.find(query, null, options)
					.populate(populate_object).lean<Molecule<A,D>[]>();
			}else{
				mon_find_res = await this._raw.find(query, null, options).lean<Molecule<A,D>[]>();
			}
		}else{
			mon_find_res = await this._raw.find(query).lean<Molecule<A,D>[]>();
		}
		return mon_find_res.map((mon_doc:Molecule<A,D>) => {
			return _clean_molecule<A,D>(this.atom_name, mon_doc);
		});
	}
	
	public async select_by_id<D extends Depth>(id:string, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		let mon_find_by_id_res:Molecule<A,D>;
		if(options && options.depth && typeof options.depth === 'number' && options.depth > 0){
			const populate_object = _generate_populate_obj(
				this.atom_name,
				options.depth,
				options.depth_query
			);
			mon_find_by_id_res = await this._raw.findById(id)
				.populate(populate_object).lean<Molecule<A,D>>();
		}else{
			mon_find_by_id_res = await this._raw.findById(id).lean<Molecule<A,D>>();
		}
		if(mon_find_by_id_res === null){
			throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
		}
		return _clean_molecule<A,D>(this.atom_name, mon_find_by_id_res);
	}
	
	public async select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		let mon_find_one_res:Molecule<A,D>;
		if(options && options.depth && typeof options.depth === 'number' && options.depth > 0){
			const populate_object = _generate_populate_obj(
				this.atom_name,
				options.depth,
				options.depth_query
			);
			mon_find_one_res = await this._raw.findOne(query).sort(options.sort)
				.populate(populate_object).lean<Molecule<A,D>>();
		}else{
			mon_find_one_res = await this._raw.findOne(query).lean<Molecule<A,D>>();
		}
		if(mon_find_one_res === null){
			throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
		}
		return _clean_molecule<A,D>(this.atom_name, mon_find_one_res);
	}
	
	public async count(query:Query<A>)
			:Promise<number>{
		const mon_count_res = await this._raw.countDocuments(query).lean<number>();
		return mon_count_res;
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
		return _clean_atom<A>(this.atom_name, mon_obj as Atom<A>);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
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
		const mon_update_res =
			await this._raw.findByIdAndUpdate({_id:id}, update, {new: true, lean: true}) as unknown;
		if(mon_update_res === null){
			throw urn_exc.create_not_found('ALTER_BY_ID_NOT_FOUND', `Cannot alter_by_id. Record not found.`);
		}
		return _clean_atom<A>(this.atom_name, mon_update_res as Atom<A>);
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
			throw urn_exc.create_not_found('REPLACE_BY_ID_NOT_FOUND', `Cannot replace_by_id. Record not found.`);
		}
		const cleaned = _clean_atom(this.atom_name, mon_update_res as Atom<A>);
		return cleaned;
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		if(typeof id !== 'string' || id === '' || !this.is_valid_id(id)){
			const err_msg = `Cannot delete_by_id. Invalid id param.`;
			throw urn_exc.create_invalid_request('DEL_BY_ID_INVALID_ID', err_msg);
		}
		const mon_delete_res =
			await this._raw.findOneAndDelete({_id:id});
		if(typeof mon_delete_res !== 'object' ||  mon_delete_res === null){
			throw urn_exc.create_not_found('DEL_BY_ID_NOT_FOUND', `Cannot delete_by_id. Record not found.`);
		}
		return _clean_atom(this.atom_name, mon_delete_res.toObject() as Atom<A>);
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

function _find_unsets<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>){
	const unsets = {} as Unset;
	const type_atom_props = atm_keys.get_bond(atom_name);
	for(const [prop, value] of Object.entries(partial_atom)){
		if(type_atom_props.has(prop as keyof Partial<AtomShape<A>>) && value === ''){
			unsets[prop] = 1;
		}
	}
	return unsets;
}

function _clean_unset<A extends AtomName>(atom_name:A, partial_atom:Partial<AtomShape<A>>){
	const type_atom_props = atm_keys.get_bond(atom_name);
	for(const [prop, value] of Object.entries(partial_atom)){
		if(type_atom_props.has(prop as keyof Partial<AtomShape<A>>) && value === ''){
			delete partial_atom[prop as keyof Partial<AtomShape<A>>];
		}
	}
	return partial_atom;
}

function _generate_subatomkey_populate_obj<A extends AtomName>(
	atom_name:A,
	subatom_key:string,
	depth:number,
	depth_query?:Query<A>
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

function _generate_populate_obj<A extends AtomName>(atom_name:A, depth?:number, depth_query?:Query<A>)
		:PopulateObject[]{
	const subatom_keys = atm_keys.get_bond(atom_name);
	const populate_object = [];
	if(depth && depth > 0 && depth <= core_config.max_query_depth_allowed && subatom_keys.size){
		for(const k of subatom_keys){
			populate_object.push(
				_generate_subatomkey_populate_obj(atom_name, k as string, depth - 1, depth_query)
			);
		}
	}
	return populate_object;
}
	
function _clean_atom<A extends AtomName>(atom_name:A, atom:Atom<A>)
		:Atom<A>{
	if(atom._id){
		atom._id = atom._id.toString();
	}
	if(urn_util.object.has_key(atom,'__v')){
		delete (atom as any).__v;
	}
	const subatom_keys = atm_keys.get_bond<A>(atom_name) as Set<keyof Atom<A>>;
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
				}else if(_is_valid_id(prop as string)){
					atom[subkey] = prop.toString() as any;
				}else if(typeof prop === 'object'){
					atom[subkey] = _clean_molecule(subatom_name, prop as any) as any;
				}
			}
		}
	}
	return atom;
}

function _clean_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:Molecule<A,D>{
	if(molecule._id){
		molecule._id = molecule._id.toString();
	}
	if(urn_util.object.has_key(molecule,'__v')){
		delete (molecule as any).__v;
	}
	const subatom_keys = atm_keys.get_bond<A>(atom_name) as Set<keyof Molecule<A,D>>;
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
				}else if(_is_valid_id(prop as any)){
					molecule[subkey] = prop.toString() as any;
				}else if(typeof prop === 'object'){
					molecule[subkey] = _clean_molecule(subatom_name, prop as any) as any;
				}
			}
		}
	}
	return molecule;
}

export function create<A extends AtomName>(atom_name: A)
		:MongooseRelation<A>{
	
	urn_log.fn_debug(`Create MongooseRelation`);
	
	return new MongooseRelation<A>(atom_name);
}

