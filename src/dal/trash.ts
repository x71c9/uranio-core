/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

// import * as urn_atm from '../atm/';

import * as urn_rel from '../rel/';

// import * as urn_validators from '../vali/';

import {
	// atom_hard_properties,
	// atom_common_properties,
	AtomName,
	// AtomShape,
	Atom,
	// Book,
	// BookPropertyType
} from '../types';

// import {atom_book} from '../book';

import {core_config} from '../config/defaults';

const urn_exc = urn_exception.init('VAL_DAL', 'Validation DAL');

import {AbstractDAL, create_abstract} from './abs';

import {EncryptDAL} from './encrypt';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
export class WithTrashDAL<A extends AtomName> extends EncryptDAL<A>{
	
	public trash_dal:AbstractDAL<A>;
	
	constructor(atom_name:A) {
		super(atom_name);
		let db_trash_relation:urn_rel.Relation<A>;
		switch(core_config.db_type){
			case 'mongo':{
				db_trash_relation = urn_rel.mongo.trash_create<A>(this.atom_name);
				this.trash_dal = create_abstract(this.atom_name, db_trash_relation);
				break;
			}
			default:{
				const err_msg = `The Database type in the configuration data is invalid.`;
				throw urn_exc.create('INVALID_DB_TYPE', err_msg);
				break;
			}
		}
	}
	
	public async delete_by_id(id:string)
			:Promise<Atom<A>>{
		const db_res_delete = await super.delete_by_id(id);
		db_res_delete._deleted_from = db_res_delete._id;
		await this.trash_dal.insert_one(db_res_delete);
		return db_res_delete;
	}
}

// export type DalInstance = InstanceType<typeof DAL>;

export function create_encrypt<A extends AtomName>(atom_name:A)
		:EncryptDAL<A>{
	urn_log.fn_debug(`Create EncrtyptDAL [${atom_name}]`);
	return new EncryptDAL<A>(atom_name);
}

