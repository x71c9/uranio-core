/**
 * Class for Validate Data Access Layer
 *
 * This class will validate all Atom before and after saving to the db.
 * If the Atoms are not valid it will throw Exceptions.
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('VAL_DAL', 'ValidateDAL');

import * as atm_validate from '../atm/validate';

import * as atm_keys from '../atm/keys';

import {
	Depth,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../typ/atom';

import {Query} from '../typ/query';

import {RelationDAL} from './rel';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class ValidateDAL<A extends AtomName> extends RelationDAL<A>{
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A, D>)
			:Promise<Molecule<A, D>[]>{
		const atom_array = await super.select<D>(query, options);
		for(let i = 0; i < atom_array.length; i++){
			const depth = (options && options.depth) ? options.depth : undefined;
			atom_array[i] = await this.validate<D>(atom_array[i]!, depth);
		}
		return atom_array;
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		if(!this._db_relation.is_valid_id(id)){
			throw urn_exc.create_invalid_request('INVALID_ID', `Invalid request [_id].`);
		}
		let db_record = await super.select_by_id(id, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		db_record = await this.validate<D>(db_record, depth);
		return db_record;
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		if(urn_util.object.has_key(query,'_id') && (query as Query.Equal<A>)._id){
			return this.select_by_id((query as any)._id, options);
		}
		let db_record = await super.select_one(query, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		db_record = await this.validate<D>(db_record, depth);
		return db_record;
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		atm_validate.atom_shape(this.atom_name, atom_shape);
		await this._check_unique(atom_shape as Partial<AtomShape<A>>);
		let db_record = await super.insert_one(atom_shape);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		atm_validate.atom_partial(this.atom_name, partial_atom);
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
		const unique_keys = atm_keys.get_unique(this.atom_name);
		for(const k of unique_keys){
			$or.push({[k]: partial_atom[k]});
		}
		if($or.length === 0){
			return true;
		}
		let query:Query<A> = {};
		if(typeof id === 'string' && this._db_relation.is_valid_id(id)){
			query = {$and: [{_id: {$ne: id}}, {$or: $or}]} as Query<A>;
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
			err_msg += ` Duplicate fields: ${urn_util.json.safe_stringify_oneline(equal_values)}.`;
			throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
		}catch(err){
			if(err.type && err.type === urn_exception.ExceptionType.NOT_FOUND){
				return true;
			}
			throw err;
		}
		// return true;
	}
	
	protected async validate(molecule:Atom<A>):Promise<Atom<A>>;
	protected async validate(molecule:Atom<A>, depth?:0):Promise<Atom<A>>;
	protected async validate<D extends Depth>(molecule:Molecule<A,D>, depth?:D):Promise<Molecule<A,D>>
	protected async validate<D extends Depth>(molecule:Molecule<A,D> | Atom<A>, depth?:D)
			:Promise<Molecule<A,D> | Atom<A>>{
		return atm_validate.any<A,D>(this.atom_name, molecule as Molecule<A,D>, depth);
	}
	
}

export function create_validate<A extends AtomName>(atom_name:A)
		:ValidateDAL<A>{
	urn_log.fn_debug(`Create ValidateDAL [${atom_name}]`);
	return new ValidateDAL<A>(atom_name);
}

