/**
 * Class for Encrypt Data Access Layer
 *
 * This class handle schema.Atom's encrypted properties.
 * It will encrypt before `insert_one`
 * It will also check if a property with ENCRYPT type has changed and encrypt
 * it again before `alter_by_id`.
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`DAL_ENCRYPT`, `Encryption DAL.`);

import {schema} from '../sch/server';

import * as atm_encrypt from '../atm/encrypt';

import * as book from '../book/server';

import * as types from '../server/types';

import {create_basic, BasicDAL} from './basic';

import {ValidateDAL} from './validate';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class EncryptDAL<A extends schema.AtomName> extends ValidateDAL<A>{
	
	private abstract_dal:BasicDAL<A>;
	
	constructor(atom_name:A){
		super(atom_name);
		this.abstract_dal = create_basic(this.atom_name, this._db_relation);
	}
	
	public async insert_one(atom_shape:schema.AtomShape<A>)
			:Promise<schema.Atom<A>>{
		atom_shape = await atm_encrypt.properties<A>(this.atom_name, atom_shape);
		return await super.insert_one(atom_shape);
	}
	
	public async alter_by_id(id:string, partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>>{
		partial_atom = await this._encrypt_changed_properties(id, partial_atom);
		return super.alter_by_id(id, partial_atom);
	}
	
	public async insert_multiple(atom_shapes:schema.AtomShape<A>[])
			:Promise<schema.Atom<A>[]>{
		for(let atom_shape of atom_shapes){
			atom_shape = await atm_encrypt.properties<A>(this.atom_name, atom_shape);
		}
		return await super.insert_multiple(atom_shapes);
	}
	
	public async alter_multiple(ids:string[], partial_atom:Partial<schema.AtomShape<A>>)
			:Promise<schema.Atom<A>[]>{
		partial_atom = await atm_encrypt.properties<A>(this.atom_name, partial_atom);
		return super.alter_multiple(ids, partial_atom);
	}
	
	protected async _encrypt_changed_properties(
		id:string,
		atom:schema.Atom<A>
	):Promise<schema.Atom<A>>;
	protected async _encrypt_changed_properties(
		id:string,
		atom:Partial<schema.AtomShape<A>>
	):Promise<Partial<schema.AtomShape<A>>>;
	protected async _encrypt_changed_properties(
		id:string,
		atom:schema.Atom<A> | Partial<schema.AtomShape<A>>
	):Promise<schema.Atom<A> | Partial<schema.AtomShape<A>>>{
		const all_props = book.get_full_properties_definition(this.atom_name);
		let k:keyof schema.Atom<A>;
		for(k in atom){
			const prop_def = all_props[k as string];
			
			if(prop_def && prop_def.type === types.PropertyType.ENCRYPTED){
				let value = (atom as any)[k];
				
				if(typeof value !== 'string'){
					throw urn_exc.create_invalid_atom(
						`INVALID_ENCRYPTED_PROP_VALUE_TYPE`,
						`PropertyType [${k}] of type ENCRYPTED must be of type \`string\`.`
					);
				}
				
				if(value.length !== 60 || !value.startsWith('$2')){
					
					value = await atm_encrypt.property<A>(this.atom_name, k, value);
					
				}else{
					
					const res_select = await this.abstract_dal.select_by_id(id);
					const db_prop = res_select[k];
					if(db_prop && (db_prop as unknown) !== value){
						value = await atm_encrypt.property<A>(this.atom_name, k, value);
					}
					
				}
				(atom as any)[k] = value;
			}
		}
		return atom;
	}
	
}

export function create_encrypt<A extends schema.AtomName>(atom_name:A)
		:EncryptDAL<A>{
	urn_log.fn_debug(`Create EncrtyptDAL [${atom_name}]`);
	return new EncryptDAL<A>(atom_name);
}

