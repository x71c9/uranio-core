/**
 * Class for Selfish Data Access Layer
 *
 * This class will autofix Atoms when retrieving them from the db.
 * If a property of an Atom is invalid the class will try to replace with a
 * function return value or a default value defined in `atom_book`.
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

import * as atm_validate from '../atm/validate';

import * as atm_util from '../atm/util';

import * as atm_keys from '../atm/keys';

import {
	Depth,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../typ/';

import {RecycleDAL} from './recycle';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class SelfishDAL<A extends AtomName> extends RecycleDAL<A>{
	
	protected async _replace_atom_on_error(id:string, atom:Atom<A>)
			:Promise<Atom<A>>{
		atom = await this._encrypt_changed_properties(id, atom);
		atom = await this._fix_atom_on_validation_error(atom);
		const db_res_insert = await this._db_relation.replace_by_id(id, atom);
		atm_validate.atom<A>(this.atom_name, db_res_insert);
		return db_res_insert;
	}
	
	protected async _replace_molecule_on_error<D extends Depth>(id:string, molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		const atom = atm_util.molecule_to_atom(this.atom_name, molecule);
		await this._replace_atom_on_error(id, atom);
		return await this.select_by_id(id, {depth: depth});
	}
	
	private async _fix_molecule_on_validation_error<D extends Depth>(molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		const bond_keys = atm_keys.get_bond(this.atom_name);
		if(!depth || (atm_util.is_atom(this.atom_name, molecule as Atom<A>) && bond_keys.size === 0)){
			return (await this._fix_atom_on_validation_error(molecule as Atom<A>)) as Molecule<A,D>;
		}else{
			for(const k of bond_keys){
				const bond_name = atm_util.get_subatom_name(this.atom_name, k as string);
				const prop_value = molecule[k] as any;
				const SUB_DAL = create_selfish(bond_name);
				const sub_depth = ((depth as number) - 1 as Depth);
				if(Array.isArray(prop_value)){
					for(let i = 0; i < prop_value.length; i++){
						const subatom = prop_value[i];
						prop_value[i] = await SUB_DAL._fix_molecule_on_validation_error(subatom, sub_depth);
					}
				}else{
					molecule[k] = await SUB_DAL._fix_molecule_on_validation_error(prop_value, sub_depth) as any;
				}
			}
		}
		try{
			atm_validate.molecule_primitive_properties(this.atom_name, molecule);
		}catch(exc){
			if(exc.type !== urn_exception.ExceptionType.INVALID_ATOM){
				throw exc;
			}
			if(this.trash_dal){
				const clone_molecule = {...molecule};
				clone_molecule._deleted_from = molecule._id;
				await this.trash_dal.insert_one(clone_molecule as AtomShape<A>);
			}
			let k:keyof Atom<A>;
			for(k of exc.keys){
				if(urn_util.object.has_key(molecule, k) && !atm_util.has_property(this.atom_name, k)){
					delete molecule[k];
				}else{
					molecule = atm_util.fix_property<A,D>(this.atom_name, molecule, k);
				}
			}
			molecule = await this._replace_molecule_on_error(molecule._id, molecule, depth);
		}
		return molecule;
	}
	
	private async _fix_atom_on_validation_error(atom:Atom<A>)
			:Promise<Atom<A>>{
		try{
			atm_validate.atom<A>(this.atom_name, atom);
		}catch(exc){
			if(exc.type !== urn_exception.ExceptionType.INVALID_ATOM){
				throw exc;
			}
			if(this.trash_dal){
				const clone_atom = {...atom};
				clone_atom._deleted_from = clone_atom._id;
				await this.trash_dal.insert_one(clone_atom);
			}
			let k:keyof Atom<A>;
			for(k of exc.keys){
				if(urn_util.object.has_key(atom, k) && !atm_util.has_property(this.atom_name, k)){
					delete atom[k];
				}else{
					atom = atm_util.fix_property<A>(this.atom_name, atom, k);
				}
			}
			atom = await this._replace_atom_on_error(atom._id, atom);
		}
		return atom;
	}
	
	protected async validate(molecule:Atom<A>):Promise<Atom<A>>;
	protected async validate(molecule:Atom<A>, depth?:0):Promise<Atom<A>>;
	protected async validate<D extends Depth>(molecule:Molecule<A,D>, depth?:D):Promise<Molecule<A,D>>;
	protected async validate<D extends Depth>(molecule:Molecule<A,D> | Atom<A>, depth?:D)
			:Promise<Molecule<A,D> | Atom<A>>{
		return await this._fix_molecule_on_validation_error<D>(molecule as Molecule<A,D>, depth);
	}
	
}

export function create_selfish<A extends AtomName>(atom_name:A)
		:SelfishDAL<A>{
	urn_log.fn_debug(`Create SelfishDAL [${atom_name}]`);
	return new SelfishDAL<A>(atom_name);
}

