/**
 * Class for Selfish/Autofix Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

import * as urn_atm from '../atm/';

import {
	Depth,
	AtomName,
	AtomShape,
	Atom,
	Molecule
} from '../types';

import {RecycleDAL} from './recycle';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class SelfishDAL<A extends AtomName> extends RecycleDAL<A>{
	
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
		return await this.select_by_id(id, depth);
	}
	
	private async _fix_molecule_on_validation_error<D extends Depth>(molecule:Molecule<A,D>, depth?:D)
			:Promise<Molecule<A,D>>{
		const bond_keys = urn_atm.get_bond_keys(this.atom_name);
		if(!depth || (urn_atm.is_atom(this.atom_name, molecule as Atom<A>) && bond_keys.size === 0)){
			return (await this._fix_atom_on_validation_error(molecule as Atom<A>)) as Molecule<A,D>;
		}else{
			for(const k of bond_keys){
				const bond_name = urn_atm.get_subatom_name(this.atom_name, k as string);
				let prop_value = molecule[k] as any;
				const SUBDAL = create_selfish(bond_name);
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
			if(this.trash_dal){
				const clone_molecule = {...molecule};
				clone_molecule._deleted_from = molecule._id;
				await this.trash_dal.insert_one(clone_molecule as AtomShape<A>);
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
			if(this.trash_dal){
				const clone_atom = {...atom};
				clone_atom._deleted_from = clone_atom._id;
				await this.trash_dal.insert_one(clone_atom);
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

