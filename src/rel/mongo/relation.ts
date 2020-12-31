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

import {core_config} from '../../config/defaults';

import * as urn_atm from '../../atm/';

import {Relation} from '../types';

import {ConnectionName, PopulateObject} from './types';

import {models_by_connection} from './models';

const urn_exc = urn_exception.init('REL_MONGO', 'Mongoose Relation');

/**
 * Mongoose Relation class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class MongooseRelation<A extends AtomName> implements Relation<A> {
	
	protected _conn_name:ConnectionName = 'main';
	
	protected _raw:mongoose.Model<mongoose.Document>;
	
	constructor(public atom_name:A) {
		
		const models_map = models_by_connection.get(this._conn_name);
		if(!models_map){
			const err_msg = `Cannot find models for connection [${this._conn_name}]`;
			throw urn_exc.create('MODELS_NOT_FOUND', err_msg);
		}
		const model = models_map.get(this.atom_name);
		if(!model){
			let err_msg = `Cannot find model for atom [${this.atom_name}]`;
			err_msg += ` and connection [${this._conn_name}]`;
			throw urn_exc.create('MODEL_NOT_FOUND', err_msg);
		}
		this._raw = model;
		
	}
	
	protected _generate_subatomkey_populate_obj<A extends AtomName>(atom_name:A, subatom_key:string, depth:number)
				:PopulateObject{
		const subatom_name = urn_atm.get_subatom_name(atom_name, subatom_key);
		let populate_object:PopulateObject = {path: subatom_key, model: subatom_name};
		const subsubatom_keys = urn_atm.get_subatom_keys(subatom_name);
		if(subsubatom_keys.size === 0 || depth == 0)
			return populate_object;
		const subpops:PopulateObject[] = [];
		for(const subsubkey of subsubatom_keys){
			subpops.push(
				this._generate_subatomkey_populate_obj(subatom_name, subsubkey, depth - 1)
			);
		}
		populate_object = {
			...populate_object,
			populate: subpops
		};
		return populate_object;
	}
	
	public async select<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		let mon_find_res:Molecule<A,D>[] = [];
		if(options){
			const subatom_keys = urn_atm.get_subatom_keys(this.atom_name);
			const populate_object = [];
			if(
				options.depth &&
				options.depth > 0 &&
				options.depth < core_config.max_query_depth_allowed &&
				subatom_keys.size
			){
				for(const k of subatom_keys){
					populate_object.push(
						this._generate_subatomkey_populate_obj(
							this.atom_name, k as string, 
							(options.depth as number) - 1
						)
					);
				}
				mon_find_res = await this._raw.find(query, null, options)
					.populate(populate_object).lean<Molecule<A,D>[]>();
			}else{
				mon_find_res = await this._raw.find(query, null, options)
					.lean<Molecule<A,D>[]>();
			}
		}else{
			mon_find_res = await this._raw.find(query).lean<Molecule<A,D>[]>();
		}
		return mon_find_res.map((mon_doc:Molecule<A,D>) => {
			return _clean_molecule<A,D>(this.atom_name, mon_doc);
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
		// return _clean_atom(mon_find_by_id_res as Atom<A>);
		return _clean_molecule<A,D>(this.atom_name, mon_find_by_id_res);
	}
	
	public async select_one<D extends Depth>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		const mon_find_one_res = (typeof options !== 'undefined' && options.sort) ?
			await this._raw.findOne(query).sort(options.sort).lean<Molecule<A,D>>() :
			await this._raw.findOne(query).lean<Molecule<A,D>>();
		if(mon_find_one_res === null){
			throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
		}
		// return _clean_atom(mon_find_one_res as Atom<A>);
		return _clean_molecule<A,D>(this.atom_name, mon_find_one_res);
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
		return _clean_atom<A>(mon_update_res as Atom<A>);
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
		return _clean_atom(mon_update_res as Atom<A>);
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
		return _clean_atom(mon_delete_res.toObject() as Atom<A>);
	}
	
	public is_valid_id(id:string)
		:boolean{
		return _is_valid_id(id);
	}
	
}

function _clean_atom<A extends AtomName>(atom:Atom<A>)
		:Atom<A>{
	if(atom._id){
		atom._id = atom._id.toString();
	}
	if(urn_util.object.has_key(atom,'__v')){
		delete (atom as any).__v;
	}
	return atom;
}

function _is_valid_id(id:string)
		:boolean{
	return mongoose.Types.ObjectId.isValid(id);
}

function _clean_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:Molecule<A,D>{
	if(molecule._id){
		molecule._id = molecule._id.toString();
	}
	if(urn_util.object.has_key(molecule,'__v')){
		delete (molecule as any).__v;
	}
	const subatom_keys = urn_atm.get_subatom_keys<A>(atom_name) as Set<keyof Molecule<A, D>>;
	if(subatom_keys.size > 0){
		for(const subkey of subatom_keys){
			const subatom_name = urn_atm.get_subatom_name<A>(atom_name, subkey as string);
			if(molecule[subkey]){
				if(Array.isArray(molecule[subkey])){
					for(let i = 0; i < (molecule[subkey] as []).length; i++){
						if(_is_valid_id((molecule[subkey] as [])[i])){
							(molecule[subkey] as Array<any>)[i] = ((molecule[subkey] as [])[i] as any).toString();
						}else if(typeof (molecule[subkey] as [])[i] === 'object'){
							(molecule[subkey] as Array<any>)[i] =
								_clean_molecule(subatom_name, (molecule[subkey] as [])[i]);
						}
					}
				}else if(typeof molecule[subkey] === 'object'){
					molecule[subkey] = _clean_molecule(subatom_name, molecule[subkey] as any) as any;
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

