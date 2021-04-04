/**
 * Config types module
 *
 * @packageDocumentation
 */


export type DatabaseType = 'mongo'; // | 'mysql'

type RequiredConfigParams = {
	
	db_type: DatabaseType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
}

type OptionalConfigParam = {
	
	db_trash_host: string,
	
	db_trash_port: number,
	
	db_log_host: string,
	
	db_log_port: number,
	
	encryption_round: number;
	
	max_password_length: number;
	
	max_query_depth_allowed: 0 | 1 | 2 | 3;
	
}

export type Configuration = RequiredConfigParams & Partial<OptionalConfigParam>;

export type FullConfiguration = RequiredConfigParams & OptionalConfigParam;
