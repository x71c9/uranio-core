/**
 * Class for Recycle Data Access Layer
 *
 * This class will move a deleted Atom to the Trash database instead of just
 * deleting it.
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

// import {atom_book} from 'uranio-books/atom';

import * as urn_rel from '../rel/';

import {
	AtomName,
	Atom,
} from '../typ/atom';

// import {Book} from '../typ/book_srv';

import {core_config} from '../cnf/defaults';

import {BasicDAL, create_basic} from './basic';

import {EncryptDAL} from './encrypt';

import * as book from '../book/';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class RecycleDAL<A extends AtomName> extends EncryptDAL<A>{
	
	private _trash_dal?:BasicDAL<A>;
	
	constructor(atom_name:A) {
		
		super(atom_name);
		
	}
	
	public get trash_dal():BasicDAL<A>{
		if(this._trash_dal === undefined){
			let db_trash_relation:urn_rel.Relation<A>;
			// const atom_def = atom_book[this.atom_name] as Book.BasicDefinition;
			const atom_def = book.atom.get_definition(this.atom_name);
			if(!atom_def.connection || atom_def.connection === 'main'){
				switch(core_config.db_type){
					case 'mongo':{
						db_trash_relation = urn_rel.mongo.trash_create<A>(this.atom_name);
						this._trash_dal = create_basic(this.atom_name, db_trash_relation);
						break;
					}
					// default:{
					//   const err_msg = `The Database type in the configuration data is invalid.`;
					//   throw urn_exc.create('INVALID_DB_TYPE', err_msg);
					// }
				}
			}
		}
		return this._trash_dal as BasicDAL<A>;
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

