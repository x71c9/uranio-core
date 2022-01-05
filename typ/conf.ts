/**
 * Config types module
 *
 * @packageDocumentation
 */

export type DatabaseType = 'mongo'; // | 'mysql'

export type StorageType = 'aws'; // | 'gcloud' | 'localhost'

type RequiredConfigParams = {
	
	db_type: DatabaseType
	
	mongo_main_connection: string
	
	db_main_name: string
	
	db_trash_name: string
	
	db_log_name: string
	
	superuser_email: string
	
	superuser_password: string
	
	jwt_private_key: string
	
}

type OptionalConfigParam = {
	
	connect_on_init: boolean,
	
	mongo_trash_connection: string
	
	mongo_log_connection: string
	
	encryption_rounds: number
	
	max_password_length: number
	
	max_query_depth_allowed: 0 | 1 | 2 | 3
	
	storage: StorageType
	
	aws_bucket_name: string
	
	aws_bucket_region: string
	
	aws_user_access_key_id: string
	
	aws_user_secret_access_key: string
	
}

export type Configuration = RequiredConfigParams & Partial<OptionalConfigParam>;

export type FullConfiguration = RequiredConfigParams & OptionalConfigParam;
