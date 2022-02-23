/**
 * Class for Main Data Access Layer
 *
 * This class will select the Relation the DAL should use.
 * Check the type of DB defined in the config.
 * Use a Log Relation if the Atom has the `connection` property set to `log`.
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONN_DAL', 'RelationDAL');

import {schema} from '../sch/server';

import * as urn_rel from '../rel/server';

import * as book from '../book/server';

import * as conf from '../conf/server';

import {BasicDAL} from './basic';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class RelationDAL<A extends schema.AtomName> extends BasicDAL<A>{
	
	constructor(atom_name:A) {
		let db_relation: urn_rel.Relation<A>;
		switch(conf.get(`db_type`)){
			case 'mongo':{
				const atom_def = book.get_definition(atom_name);
				switch(atom_def.connection){
					case 'log':
						db_relation = urn_rel.mongo.log_create<A>(atom_name);
						break;
					default:
						db_relation = urn_rel.mongo.create<A>(atom_name);
				}
				break;
			}
			default:{
				const err_msg = `The Database type in the configuration data is invalid.`;
				throw urn_exc.create('INVALID_DB_TYPE', err_msg);
			}
		}
		super(atom_name, db_relation);
	}
	
}

export function create_main<A extends schema.AtomName>(atom_name:A)
		:RelationDAL<A>{
	urn_log.fn_debug(`Create RelationDAL [${atom_name}]`);
	return new RelationDAL<A>(atom_name);
}

