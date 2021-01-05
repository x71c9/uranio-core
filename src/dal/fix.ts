/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

import * as urn_atm from '../atm/';

import {
	Depth,
	Query,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../types';

// const urn_exc = urn_exception.init('AutoFixDAL', 'AutoFixDAL module');

import {DAL} from './dal';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class AutoFixDAL<A extends AtomName> extends DAL<A>{
	
	public async select<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A, D>)
			:Promise<Molecule<A, D>[]>{
		const atom_array = await this._select<D>(query, options);
		for(let i = 0; i < atom_array.length; i++){
			const depth = (options && options.depth) ? options.depth : undefined;
			atom_array[i] = await this._fix_molecule_on_validation_error<D>(atom_array[i], depth);
		}
		return atom_array;
	}
	
	public async select_by_id<D extends Depth = 0>(id:string, depth?:D)
			:Promise<Molecule<A,D>>{
		const db_record = await this._select_by_id(id, depth);
		return await this._fix_molecule_on_validation_error<D>(db_record, depth);
	}
	
	public async select_one<D extends Depth = 0>(query:Query<A>, options?:Query.Options<A,D>)
			:Promise<Molecule<A,D>>{
		const db_record = await this._select_one(query, options);
		const depth = (options && options.depth) ? options.depth : undefined;
		return await this._fix_molecule_on_validation_error<D>(db_record, depth);
	}
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		atom_shape = await urn_atm.encrypt_properties<A>(this.atom_name, atom_shape);
		await this._check_unique(atom_shape as Partial<AtomShape<A>>);
		const db_record = await this._insert_one(atom_shape);
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		await this._check_unique(partial_atom, id);
		const db_record = await this._alter_by_id(id, partial_atom);
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async alter_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		const db_record = await this.alter_by_id(atom._id, atom as Partial<AtomShape<A>>);
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		const db_res_delete = await this._delete_by_id(id);
		if(db_res_delete && this._db_trash_relation){
			db_res_delete._deleted_from = db_res_delete._id;
			return await this.trash_insert_one(db_res_delete);
		}
		const db_record = db_res_delete;
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	public async delete_one(atom:Atom<A>)
			:Promise<Atom<A>>{
		const db_record = await this.delete_by_id(atom._id);
		return db_record;
		return await this._fix_atom_on_validation_error(db_record);
	}
	
	protected async _replace_atom_on_error(id:string, atom:Atom<A>)
			:Promise<Atom<A>>{
		atom = await this._encrypt_changed_properties(id, atom);
		atom = await this._fix_atom_on_validation_error(atom);
		const db_res_insert = await this._db_relation.replace_by_id(id, atom);
		urn_atm.validate_atom<A>(this.atom_name, db_res_insert);
		return db_res_insert;
	}
	
	protected async _replace_molecule_on_error<D extends Depth>(id:string, molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		const atom = urn_atm.molecule_to_atom(this.atom_name, molecule);
		await this._replace_atom_on_error(id, atom);
		return await this._select_by_id(id, depth);
	}
	
	private async _fix_molecule_on_validation_error<D extends Depth>(molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		if(!depth){
			return (await this._fix_atom_on_validation_error(molecule as Atom<A>)) as Molecule<A,D>;
		}else{
			const bond_keys = urn_atm.get_bond_keys(this.atom_name);
			for(const k of bond_keys){
				const bond_name = urn_atm.get_subatom_name(this.atom_name, k as string);
				let prop_value = molecule[k] as any;
				const SUBDAL = create_autofix(bond_name);
				if(Array.isArray(prop_value)){
					for(let i = 0; i < prop_value.length; i++){
						let subatom = prop_value[i];
						subatom =
							await SUBDAL._fix_molecule_on_validation_error(subatom, ((depth as number) - 1 as Depth));
					}
				}else{
					prop_value =
						await SUBDAL._fix_molecule_on_validation_error(prop_value, ((depth as number) - 1 as Depth));
				}
			}
		}
		try{
			urn_atm.validate_molecule_primitive_properties(this.atom_name, molecule);
		}catch(exc){
			if(exc.type !== urn_exception.ExceptionType.INVALID){
				throw exc;
			}
			if(this._db_trash_relation){
				const clone_molecule = {...molecule};
				clone_molecule._deleted_from = molecule._id;
				await this._db_trash_relation.insert_one(clone_molecule as AtomShape<A>);
			}
			let k:keyof Atom<A>;
			for(k of exc.keys){
				if(molecule[k] && !urn_atm.is_valid_property(this.atom_name, k)){
					delete molecule[k];
				}else{
					molecule = urn_atm.fix_property<A,D>(this.atom_name, molecule, k);
				}
			}
			molecule = await this._replace_molecule_on_error(molecule._id, molecule, depth);
		}
		return molecule;
	}
	
	private async _fix_atom_on_validation_error(atom:Atom<A>)
			:Promise<Atom<A>>{
		try{
			urn_atm.validate_atom<A>(this.atom_name, atom);
		}catch(exc){
			if(exc.type !== urn_exception.ExceptionType.INVALID){
				throw exc;
			}
			if(this._db_trash_relation){
				const clone_atom = {...atom};
				clone_atom._deleted_from = clone_atom._id;
				await this._db_trash_relation.insert_one(clone_atom);
			}
			let k:keyof Atom<A>;
			for(k of exc.keys){
				if(atom[k] && !urn_atm.is_valid_property(this.atom_name, k)){
					delete atom[k];
				}else{
					atom = urn_atm.fix_property<A>(this.atom_name, atom, k);
				}
			}
			atom = await this._replace_atom_on_error(atom._id, atom);
		}
		return atom;
	}
	
}

// export type DalInstance = InstanceType<typeof DAL>;

export function create_autofix<A extends AtomName>(atom_name:A):AutoFixDAL<A>{
	urn_log.fn_debug(`Create AutoFixDAL [${atom_name}]`);
	return new AutoFixDAL<A>(atom_name);
}

