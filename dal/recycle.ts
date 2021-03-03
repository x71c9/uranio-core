/**
 * Class for Recycle Data Access Layer
 *
 * This class will move a deleted Atom to the Trash database instead of just
 * deleting it.
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {atom_book} from 'urn_books';

import * as urn_rel from '../rel/';

import {
	AtomName,
	Atom,
	Book
} from '../typ/';

import {core_config} from '../conf/defaults';

import {BasicDAL, create_basic} from './basic';

import {EncryptDAL} from './encrypt';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class RecycleDAL<A extends AtomName> extends EncryptDAL<A>{
	
	public trash_dal?:BasicDAL<A>;
	
	constructor(atom_name:A) {
		
		super(atom_name);
		
		let db_trash_relation:urn_rel.Relation<A>;
		
		const atom_def = atom_book[atom_name] as Book.Definition;
		if(!atom_def.connection || atom_def.connection === 'main'){
			switch(core_config.db_type){
				case 'mongo':{
					db_trash_relation = urn_rel.mongo.trash_create<A>(this.atom_name);
					this.trash_dal = create_basic(this.atom_name, db_trash_relation);
					break;
				}
				// default:{
				//   const err_msg = `The Database type in the configuration data is invalid.`;
				//   throw urn_exc.create('INVALID_DB_TYPE', err_msg);
				// }
			}
		}
		
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		const db_res_delete = await super.delete_by_id(id);
		if(!this.trash_dal)
			return db_res_delete;
		db_res_delete._deleted_from = db_res_delete._id;
		await this.trash_dal.insert_one(db_res_delete);
		// db_res_delete._id = id;
		return db_res_delete;
	}
}

export function create_recycle<A extends AtomName>(atom_name:A)
		:RecycleDAL<A>{
	urn_log.fn_debug(`Create RecycleDAL [${atom_name}]`);
	return new RecycleDAL<A>(atom_name);
}

