/**
 * Class for Validate Data Access Layer
 *
 * This class will validate all schema.Atom before and after saving to the db.
 * If the Atoms are not valid it will throw Exceptions.
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('VAL_DAL', 'ValidateDAL');

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

import * as atm_validate from '../atm/validate';

import * as atm_keys from '../atm/keys';

import * as book from '../book/index';

import * as types from '../types';

import {atom_hard_properties, atom_common_properties} from '../stc/index';

import {RelationDAL} from './rel';

type Equals<A extends schema.AtomName> = {
	[k in keyof schema.Atom<A>]: any
}

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class ValidateDAL<A extends schema.AtomName> extends RelationDAL<A>{
	
	public async select<D extends schema.Depth = 0>(query:schema.Query<A>, options?:schema.Query.Options<A, D>)
			:Promise<schema.Molecule<A, D>[]>{
		const atom_array = await super.select<D>(query, options);
		for(let i = 0; i < atom_array.length; i++){
			const depth = (options && options.depth) ? options.depth : undefined;
			atom_array[i] = await this.validate<D>(atom_array[i]!, depth);
		}
		return atom_array;
	}
	
	public async select_by_id<D extends schema.Depth = 0>(id:string, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		if(!this._db_relation.is_valid_id(id)){
			throw urn_exc.create_invalid_request('INVALID_ID', `Invalid request \`_id\`.`);
		}
		let db_record = await super.select_by_id(id, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		db_record = await this.validate<D>(db_record, depth);
		return db_record;
	}
	
	public async select_one<D extends schema.Depth = 0>(query:schema.Query<A>, options?:schema.Query.Options<A,D>)
			:Promise<schema.Molecule<A,D>>{
		if(urn_util.object.has_key(query,'_id') && (query as schema.Query.Equal<A>)._id){
			return this.select_by_id((query as any)._id, options);
		}
		let db_record = await super.select_one(query, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		db_record = await this.validate<D>(db_record, depth);
		return db_record;
	}
	
	public async insert_one(atom_shape:schema.AtomShape<A>)
			:Promise<schema.Atom<A>>{
		atm_validate.atom_shape(this.atom_name, atom_shape);
		_check_ids(this.atom_name, atom_shape, this._db_relation.is_valid_id);
		await this._check_unique(atom_shape as Partial<schema.AtomShape<A>>);
		let db_record = await super.insert_one(atom_shape);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>>{
		atm_validate.atom_partial(this.atom_name, partial_atom);
		_check_ids(this.atom_name, partial_atom, this._db_relation.is_valid_id);
		await this._check_unique(partial_atom, id);
		let db_record = await super.alter_by_id(id, partial_atom);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	public async delete_by_id(id:string)
			:Promise<schema.Atom<A>>{
		let db_record = await super.delete_by_id(id);
		db_record = await this.validate(db_record);
		return db_record;
	}
	
	// public async select_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
	//     :Promise<schema.Molecule<A,D>[]>{
	//   return await this.select({_id: {$in: ids}} as schema.Query<A>, options);
	// }
	
	public async alter_multiple(ids:string[], partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>[]>{
		atm_validate.atom_partial(this.atom_name, partial_atom);
		_check_ids(this.atom_name, partial_atom, this._db_relation.is_valid_id);
		await this._check_unique_multiple_ids(partial_atom, ids);
		const db_records = await super.alter_multiple(ids, partial_atom);
		const validated_db_records:schema.Atom<A>[] = [];
		for(const db_record of db_records){
			const validated_db_record = await this.validate(db_record);
			validated_db_records.push(validated_db_record);
		}
		return validated_db_records;
	}
	
	public async insert_multiple(atom_shapes:schema.AtomShape<A>[])
			:Promise<schema.Atom<A>[]>{
		for(const atom_shape of atom_shapes){
			atm_validate.atom_shape(this.atom_name, atom_shape);
			_check_ids(this.atom_name, atom_shape, this._db_relation.is_valid_id);
		}
		await this._check_unique_multiple(atom_shapes as Partial<schema.AtomShape<A>>[]);
		const db_records = await super.insert_multiple(atom_shapes);
		const validated_db_records:schema.Atom<A>[] = [];
		for(const db_record of db_records){
			const validated_db_record = await this.validate(db_record);
			validated_db_records.push(validated_db_record);
		}
		return validated_db_records;
	}
	
	public async delete_multiple(ids:string[])
			:Promise<schema.Atom<A>[]>{
		const db_records = await super.delete_multiple(ids);
		const validated_db_records:schema.Atom<A>[] = [];
		for(const db_record of db_records){
			const validated_db_record = await this.validate(db_record);
			validated_db_records.push(validated_db_record);
		}
		return validated_db_records;
	}
	
	protected async _check_unique_multiple(partial_atoms:Partial<schema.AtomShape<A>>[])
			:Promise<true>{
		const $or = [];
		const unique_keys = atm_keys.get_unique(this.atom_name);
		for(const k of unique_keys){
			for(const partial_atom of partial_atoms){
				$or.push({[k]: partial_atom[k]});
			}
		}
		if($or.length === 0){
			return true;
		}
		let query:schema.Query<A> = {};
		query = {$or: $or};
		try{
			const res_select_one = await this.select_one(query);
			const equal_values:Equals<A> = {} as Equals<A>;
			for(const partial_atom of partial_atoms){
				for(const k of unique_keys){
					if(partial_atom[k] === res_select_one[k]){
						equal_values[k] = res_select_one[k];
					}
				}
			}
			let err_msg = `schema.Atom unique fields are already in the database.`;
			err_msg += ` Duplicate fields: ${urn_util.json.safe_stringify_oneline(equal_values)}.`;
			throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
		}catch(e){
			const err = e as any;
			if(err.type && err.type === urn_exception.ExceptionType.NOT_FOUND){
				return true;
			}
			throw err;
		}
		// return true;
	}
	
	protected async _check_unique_multiple_ids(partial_atom:Partial<schema.AtomShape<A>>, ids:string[])
			:Promise<true>{
		const $or = [];
		const unique_keys = atm_keys.get_unique(this.atom_name);
		for(const k of unique_keys){
			$or.push({[k]: partial_atom[k]});
		}
		if($or.length === 0){
			return true;
		}
		let query:schema.Query<A> = {};
		if(!Array.isArray(ids)){
			throw urn_exc.create_invalid_request(
				`INVALID_IDs`,
				`Invalid \`ids\` parameters.`
			);
		}
		for(const id of ids){
			if(!this._db_relation.is_valid_id(id)){
				throw urn_exc.create_invalid_request(
					`INVALID_ID`,
					`Invalid _id.`
				);
			}
		}
		query = {$and: [{_id: {$in: ids}}, {$or: $or}]} as schema.Query<A>;
		try{
			const res_select_one = await this.select_one(query);
			const equal_values:Set<keyof schema.Atom<A>> = new Set();
			for(const k of unique_keys){
				if(partial_atom[k] === res_select_one[k]){
					equal_values.add(k);
				}
			}
			let err_msg = `schema.Atom unique fields are already in the database.`;
			err_msg += ` Duplicate fields: ${urn_util.json.safe_stringify_oneline(equal_values)}.`;
			throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
		}catch(e){
			const err = e as any;
			if(err.type && err.type === urn_exception.ExceptionType.NOT_FOUND){
				return true;
			}
			throw err;
		}
		// return true;
	}
	
	protected async _check_unique(partial_atom:Partial<schema.AtomShape<A>>, id?:string)
			:Promise<true>{
		const $or = [];
		const unique_keys = atm_keys.get_unique(this.atom_name);
		for(const k of unique_keys){
			$or.push({[k]: partial_atom[k]});
		}
		if($or.length === 0){
			return true;
		}
		let query:schema.Query<A> = {};
		if(typeof id === 'string' && this._db_relation.is_valid_id(id)){
			query = {$and: [{_id: {$ne: id}}, {$or: $or}]} as schema.Query<A>;
		}else{
			query = {$or: $or};
		}
		try{
			const res_select_one = await this.select_one(query);
			const equal_values:Set<keyof schema.Atom<A>> = new Set();
			for(const k of unique_keys){
				if(partial_atom[k] === res_select_one[k]){
					equal_values.add(k);
				}
			}
			let err_msg = `schema.Atom unique fields are already in the database.`;
			err_msg += ` Duplicate fields: ${urn_util.json.safe_stringify_oneline(equal_values)}.`;
			throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
		}catch(e){
			const err = e as any;
			if(err.type && err.type === urn_exception.ExceptionType.NOT_FOUND){
				return true;
			}
			throw err;
		}
		// return true;
	}
	
	protected async validate(molecule:schema.Atom<A>):Promise<schema.Atom<A>>;
	protected async validate(molecule:schema.Atom<A>, depth?:0):Promise<schema.Atom<A>>;
	protected async validate<D extends schema.Depth>(molecule:schema.Molecule<A,D>, depth?:D):Promise<schema.Molecule<A,D>>
	protected async validate<D extends schema.Depth>(molecule:schema.Molecule<A,D> | schema.Atom<A>, depth?:D)
			:Promise<schema.Molecule<A,D> | schema.Atom<A>>{
		return atm_validate.any<A,D>(this.atom_name, molecule as schema.Molecule<A,D>, depth);
	}
	
}

function _check_ids<A extends schema.AtomName>(
	atom_name:A,
	partial_atom:Partial<schema.AtomShape<A>>,
	is_valid_id: (id:string) => boolean
):true{
	const props = book.get_custom_property_definitions(atom_name);
	let k:keyof typeof partial_atom;
	for (k in partial_atom) {
		let prop_def = undefined;
		if (urn_util.object.has_key(atom_hard_properties, k)) {
			prop_def = atom_hard_properties[k];
		} else if (urn_util.object.has_key(atom_common_properties, k)) {
			prop_def = atom_common_properties[k];
		} else if (urn_util.object.has_key(props, k)) {
			prop_def = props[k];
		}
		if (!prop_def) {
			const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${k}\``;
			throw urn_exc.create("CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION", err_msg);
		}
		if (prop_def.type === types.BookProperty.ATOM){
			const id = partial_atom[k] as string;
			if(prop_def.optional !== true || !_is_empty_id(id)){
				_validate_id(id, is_valid_id, k as string);
			}
		}else if(prop_def.type === types.BookProperty.ATOM_ARRAY){
			const ids = partial_atom[k];
			if(Array.isArray(ids)){
				for(let i = 0; i < ids.length; i++){
					_validate_id(ids[i], is_valid_id, k as string);
				}
			}
		}
	}
	return true;
}

function _is_empty_id(id:string){
	return (id === '');
}

function _validate_id(
	id:string,
	is_valid_id:(id:string) => boolean,
	key:string
):true{
	if(!is_valid_id(id)){
		throw urn_exc.create_invalid_request(
			'INVALID_ATOM_ID',
			`Invalid schema.Atom id \`${id}\` in property \`${key}\``
		);
	}
	return true;
}

export function create_validate<A extends schema.AtomName>(atom_name:A)
		:ValidateDAL<A>{
	urn_log.fn_debug(`Create ValidateDAL [${atom_name}]`);
	return new ValidateDAL<A>(atom_name);
}

