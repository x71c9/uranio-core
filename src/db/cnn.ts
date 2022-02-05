/**
 * DB Connection methods module
 *
 * @packageDocumentation
 */

import * as conf from '../conf/';

import {mongo_app, create_all_connection} from '../rel/mongo/models';

import {ConnectionName} from "../typ/book_cln";

export function connect()
		:void{
	switch(conf.get(`db_type`)){
		case 'mongo':{
			create_all_connection();
			break;
		}
	}
}

export async function disconnect(connection_name?:ConnectionName)
		:Promise<void>{
	switch(conf.get(`db_type`)){
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
