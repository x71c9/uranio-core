/**
 * Class for Encrypt Data Access Layer
 *
 * This class handle Atom's encrypted properties.
 * It will encrypt before `insert_one`
 * It will also check if a property with ENCRYPT type has changed and encrypt
 * it again before `alter_by_id`.
 *
 * @packageDocumentation
 */

import {atom_book} from 'uranio-books/atom';

import {urn_log} from 'urn-lib';

import * as atm_encrypt from '../atm/encrypt';

import {
	AtomName,
	AtomShape,
	Atom,
} from '../typ/atom';

import {atom_hard_properties, atom_common_properties} from '../typ/static';

import {Book} from '../typ/book_srv';

import {BookPropertyType} from '../typ/common';

import {create_basic} from './basic';

import {ValidateDAL} from './validate';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class EncryptDAL<A extends AtomName> extends ValidateDAL<A>{
	
	public async insert_one(atom_shape:AtomShape<A>)
			:Promise<Atom<A>>{
		atom_shape = await atm_encrypt.properties<A>(this.atom_name, atom_shape);
		return await super.insert_one(atom_shape);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>>{
		partial_atom = await this._encrypt_changed_properties(id, partial_atom);
		return super.alter_by_id(id, partial_atom);
	}
	
	protected async _encrypt_changed_properties(id:string, atom:Atom<A>)
			:Promise<Atom<A>>;
	protected async _encrypt_changed_properties(id:string, atom:Partial<AtomShape<A>>)
			:Promise<Partial<AtomShape<A>>>;
	protected async _encrypt_changed_properties(id:string, atom:Atom<A> | Partial<AtomShape<A>>)
			:Promise<Atom<A> | Partial<AtomShape<A>>>{
		const atom_props = atom_book[this.atom_name]['properties'];
		const all_props = {
			...atom_hard_properties,
			...atom_common_properties,
			...atom_props
		} as Book.Definition.Properties;
		let k:keyof Atom<A>;
		for(k in atom){
			const prop_def = all_props[k as string];
			if(prop_def && prop_def.type && prop_def.type === BookPropertyType.ENCRYPTED){
				let value = (atom as any)[k];
				if(value && typeof value === 'string' && (value.length !== 60 || !value.startsWith('$2'))){
					value = await atm_encrypt.property(this.atom_name, k, value);
				}else{
					const abstract_dal = create_basic(this.atom_name, this._db_relation);
					const res_select = await abstract_dal.select_by_id(id);
					const db_prop = res_select[k];
					if(db_prop && db_prop !== value){
						value = await atm_encrypt.property(this.atom_name, k, value);
					}
				}
				(atom as any)[k] = value;
			}
		}
		return atom;
	}
	
}

export function create_encrypt<A extends AtomName>(atom_name:A)
		:EncryptDAL<A>{
	urn_log.fn_debug(`Create EncrtyptDAL [${atom_name}]`);
	return new EncryptDAL<A>(atom_name);
}

