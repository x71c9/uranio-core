/**
 * Class for Validate Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('VAL_DAL', 'ValidateDAL');

import * as urn_atm from '../atm/';

import * as urn_rel from '../rel/';

import {
	Depth,
	Query,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../types';

import {core_config} from '../conf/defaults';

import {BasicDAL} from './basic';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class ValidateDAL<A extends AtomName> extends BasicDAL<A>{
	
	constructor(atom_name:A) {
		let db_relation: urn_rel.Relation<A>;
		switch(core_config.db_type){
			case 'mongo':{
				db_relation = urn_rel.mongo.create<A>(atom_name);
				break;
			}
			default:{
				const err_msg = `The Database type in the configuration data is invalid.`;
				throw urn_exc.create('INVALID_DB_TYPE', err_msg);
				break;
			}
		}
		super(atom_name, db_relation);
	}
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A, D>)
			:Promise<Molecule<A, D>[]>{
		const atom_array = await super.select<D>(query, options);
		for(let i = 0; i < atom_array.length; i++){
			const depth = (options && options.depth) ? options.depth : undefined;
			atom_array[i] = await this.validate<D>(atom_array[i], depth);
		}
		return atom_array;
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		let db_record = await super.select_by_id(id, depth);
		db_record = await this.validate<D>(db_record, depth);
		return db_record;
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		let db_record = await super.select_one(query, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		db_record = await this.validate<D>(db_record, depth);
		return db_record;
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		urn_atm.validate_atom_shape(this.atom_name, atom_shape);
		await this._check_unique(atom_shape as Partial<AtomShape<A>>);
		let db_record = await super.insert_one(atom_shape);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		urn_atm.validate_atom_partial(this.atom_name, partial_atom);
		await this._check_unique(partial_atom, id);
		let db_record = await super.alter_by_id(id, partial_atom);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		let db_record = await super.delete_by_id(id);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	protected async _check_unique(partial_atom:Partial<AtomShape<A>>, id?:string)
			:Promise<true>{
		const $or = [];
		const unique_keys = urn_atm.get_unique_keys(this.atom_name);
		for(const k of unique_keys){
			$or.push({[k]: partial_atom[k]});
		}
		if($or.length === 0){
			return true;
		}
		let query:Query<A> = {};
		if(typeof id === 'string' && this._db_relation.is_valid_id(id)){
			query = {$and: [{$not: {_id: id}}, {$or: $or}]} as Query<A>;
		}else{
			query = {$or: $or};
		}
		try{
			const res_select_one = await this.select_one(query);
			const equal_values:Set<keyof Atom<A>> = new Set();
			for(const k of unique_keys){
				if(partial_atom[k] === res_select_one[k]){
					equal_values.add(k);
				}
			}
			let err_msg = `Atom unique fields are already in the database.`;
			err_msg += ` Duplicate fields: ${urn_util.formatter.json_one_line(equal_values)}.`;
			throw urn_exc.create('CHECK_UNIQUE_DUPLICATE', err_msg);
		}catch(err){
			if(err.type && err.type === urn_exception.ExceptionType.NOT_FOUND){
				return true;
			}
			throw err;
		}
		return true;
	}
	
	protected async validate(molecule:Atom<A>):Promise<Atom<A>>;
	protected async validate(molecule:Atom<A>, depth?:0):Promise<Atom<A>>;
	protected async validate<D extends Depth>(molecule:Molecule<A,D>, depth?:D):Promise<Molecule<A,D>>
	protected async validate<D extends Depth>(molecule:Molecule<A,D> | Atom<A>, depth?:D)
			:Promise<Molecule<A,D> | Atom<A>>{
		return urn_atm.validate<A,D>(this.atom_name, molecule as Molecule<A,D>, depth);
	}
	
}

export function create_validate<A extends AtomName>(atom_name:A)
		:ValidateDAL<A>{
	urn_log.fn_debug(`Create ValidateDAL [${atom_name}]`);
	return new ValidateDAL<A>(atom_name);
}

