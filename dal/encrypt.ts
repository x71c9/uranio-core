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

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`DAL_ENCRYPT`, `Encryption DAL.`);

import * as atm_encrypt from '../atm/encrypt';

import {
	AtomName,
	AtomShape,
	Atom,
} from '../typ/atom';

import * as book from '../book/';

import {BookPropertyType} from '../typ/common';

import {create_basic, BasicDAL} from './basic';

import {ValidateDAL} from './validate';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class EncryptDAL<A extends AtomName> extends ValidateDAL<A>{
	
	private abstract_dal:BasicDAL<A>;
	
	constructor(atom_name:A){
		super(atom_name);
		this.abstract_dal = create_basic(this.atom_name, this._db_relation);
	}
	
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
	
	public async insert_multiple(atom_shapes:AtomShape<A>[])
			:Promise<Atom<A>[]>{
		for(let atom_shape of atom_shapes){
			atom_shape = await atm_encrypt.properties<A>(this.atom_name, atom_shape);
		}
		return await super.insert_multiple(atom_shapes);
	}
	
	public async alter_multiple(ids:string[], partial_atom:Partial<AtomShape<A>>)
			:Promise<Atom<A>[]>{
		partial_atom = await atm_encrypt.properties<A>(this.atom_name, partial_atom);
		return super.alter_multiple(ids, partial_atom);
	}
	
	protected async _encrypt_changed_properties(
		id:string,
		atom:Atom<A>
	):Promise<Atom<A>>;
	protected async _encrypt_changed_properties(
		id:string,
		atom:Partial<AtomShape<A>>
	):Promise<Partial<AtomShape<A>>>;
	protected async _encrypt_changed_properties(
		id:string,
		atom:Atom<A> | Partial<AtomShape<A>>
	):Promise<Atom<A> | Partial<AtomShape<A>>>{
		const all_props = book.atom.get_all_property_definitions(this.atom_name);
		let k:keyof Atom<A>;
		for(k in atom){
			const prop_def = all_props[k as string];
			
			if(prop_def && prop_def.type === BookPropertyType.ENCRYPTED){
				let value = (atom as any)[k];
				
				if(typeof value !== 'string'){
					throw urn_exc.create_invalid_atom(
						`INVALID_ENCRYPTED_PROP_VALUE_TYPE`,
						`Property [${k}] of type ENCRYPTED must be of type \`string\`.`
					);
				}
				
				if(value.length !== 60 || !value.startsWith('$2')){
					
					value = await atm_encrypt.property(this.atom_name, k, value);
					
				}else{
					
					const res_select = await this.abstract_dal.select_by_id(id);
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

