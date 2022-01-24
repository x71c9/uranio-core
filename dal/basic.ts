/**
 * Class for Basic Data Access Layer
 *
 * This class is a mirror of a Relation.
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BASIC_DAL', 'BasicDAL');

import * as urn_rel from '../rel/';

import * as urn_validators from '../val/';

import {
	Depth,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../typ/atom';

import {AccessLayer} from '../typ/layer';

import {AuthAction} from '../typ/auth';

import {Query} from '../typ/query';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class BasicDAL<A extends AtomName> implements AccessLayer<A>{
	
	constructor(public atom_name:A, protected _db_relation:urn_rel.Relation<A>) {}
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
		const res_rel = await this._db_relation.select(query, options);
		return res_rel;
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		if(!this._db_relation.is_valid_id(id)){
			const err_msg = `Cannot _select_by_id. Invalid argument id.`;
			throw urn_exc.create_invalid_request('SELECT_BY_ID_INVALID_ID', err_msg);
		}
		return await this._db_relation.select_by_id(id, options);
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
		return await this._db_relation.select_one(query, options);
	}
	
	public async count(query:Query<A>)
			:Promise<number>{
		urn_validators.query.validate_filter_options_params(this.atom_name, query);
		const res_rel = await this._db_relation.count(query);
		return res_rel;
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		return await this._db_relation.insert_one(atom_shape);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		return await this._db_relation.alter_by_id(id, partial_atom);
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		return await this._db_relation.delete_by_id(id);
	}
	
	public async authorize(_action:AuthAction, _id?:string)
			:Promise<true>{
		return true;
	}
	
	// public async select_multiple<D extends Depth>(ids:string[], options?:Query.Options<A,D>)
	//     :Promise<Molecule<A,D>[]>{
	//   return await this._db_relation.select({_id: {$in: ids}} as Query<A>, options);
	// }
	
	public async alter_multiple(ids:string[], partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>[]>{
		return await this._db_relation.alter_multiple(ids, partial_atom);
	}
	
	public async insert_multiple(atom_shapes:AtomShape<A>[])
			:Promise<Atom<A>[]>{
		return await this._db_relation.insert_multiple(atom_shapes);
	}
	
	public async delete_multiple(ids:string[]):Promise<Atom<A>[]>{
		return await this._db_relation.delete_multiple(ids);
	}
	
	
}

export function create_basic<A extends AtomName>(atom_name:A, db_relation:urn_rel.Relation<A>)
		:BasicDAL<A>{
	urn_log.fn_debug(`Create BasicDAL [${atom_name}]`);
	return new BasicDAL<A>(atom_name, db_relation);
}

