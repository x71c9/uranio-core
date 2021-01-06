/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

// import * as urn_atm from '../atm/';

import * as urn_rel from '../rel/';

import * as urn_validators from '../vali/';

import {
	Depth,
	Query,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../types';

const urn_exc = urn_exception.init('ABS_DAL', 'Abstract DAL');

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class AbstractDAL<A extends AtomName> {
	
	constructor(public atom_name:A, protected _db_relation:urn_rel.Relation<A>) {}
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>[]>{
		urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
		return await this._db_relation.select(query, options);
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		if(!this._db_relation.is_valid_id(id)){
			throw urn_exc.create('SELECT_ID_INVALID_ID', `Cannot _select_by_id. Invalid argument id.`);
		}
		return await this._db_relation.select_by_id(id, depth);
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
		return await this._db_relation.select_one(query, options);
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
	
}

// export type DalInstance = InstanceType<typeof DAL>;

export function create_abstract<A extends AtomName>(atom_name:A, db_relation:urn_rel.Relation<A>):AbstractDAL<A>{
	urn_log.fn_debug(`Create Abstract DAL [${atom_name}]`);
	return new AbstractDAL<A>(atom_name, db_relation);
}

