/**
 * Config types module
 *
 * @packageDocumentation
 */


export type DatabaseType = 'mongo'; // | 'mysql'

export type Configuration = {
	
	db_type: DatabaseType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
	encryption_round: number;
	
	max_password_length: number;
	
}
