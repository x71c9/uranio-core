/**
 * Config types module
 *
 * @packageDocumentation
 */


export type DatabaseType = 'mongo'; // | 'mysql'

type RequiredConfigParams = {
	
	db_type: DatabaseType;
	
	mongo_main_connection: string,
	
	db_main_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
}

type OptionalConfigParam = {
	
	mongo_trash_connection: string,
	
	mongo_log_connection: string,
	
	encryption_round: number;
	
	max_password_length: number;
	
	max_query_depth_allowed: 0 | 1 | 2 | 3;
	
}

export type Configuration = RequiredConfigParams & Partial<OptionalConfigParam>;

export type FullConfiguration = RequiredConfigParams & OptionalConfigParam;
