/**
 * Disconnect module
 *
 * @packageDocumentation
 */

import {core_config} from '../conf/defaults';

import {mongo_app} from '../rel/mongo/models';

import {ConnectionName} from "../typ/book_cln";

export async function disconnect(connection_name?:ConnectionName)
		:Promise<void>{
	switch(core_config.db_type){
		case 'mongo':{
			if(mongo_app.connections){
				for(const [conn_name, conn_inst] of Object.entries(mongo_app.connections)){
					if(typeof connection_name === 'undefined' || conn_name === connection_name){
						await conn_inst.close();
					}
				}
			}
			break;
		}
	}
}