/**
 * Module for env variables
 *
 * @packageDocumentation
 */

import {FullConfiguration} from '../typ/conf';

type EnvVarName =
	'URN_DB_TYPE' |
	'URN_MONGO_MAIN_CONNECTION' |
	'URN_MONGO_TRASH_CONNECTION' |
	'URN_MONGO_LOG_CONNECTION' |
	'URN_DB_MAIN_NAME' |
	'URN_DB_TRASH_NAME' |
	'URN_DB_LOG_NAME' |
	'URN_JWT_PRIVATE_KEY' |
	'URN_STORAGE' |
	'URN_AWS_BUCKET_NAME' |
	'URN_AWS_BUCKET_REGION' |
	'URN_AWS_USER_ACCESS_KEY_ID' |
	'URN_AWS_USER_SECRET_ACCESS_KEY' |
	'URN_ENCRYPTION_ROUND' |
	'URN_MAX_PASSWORD_LENGTH' |
	'URN_CONNECT_ON_INIT'

type CoreConfigByEnv = {
	[k in EnvVarName]: keyof FullConfiguration;
}

type EnvVarType = 'string' | 'integer' | 'float' | 'natural' | 'boolean';

type EnvVarsByType = {
	[k in EnvVarType]: EnvVarName[];
}

export const core_config_by_env:CoreConfigByEnv = {
	'URN_DB_TYPE':'db_type',
	'URN_MONGO_MAIN_CONNECTION':'mongo_main_connection',
	'URN_MONGO_TRASH_CONNECTION':'mongo_trash_connection',
	'URN_MONGO_LOG_CONNECTION':'mongo_log_connection',
	'URN_DB_MAIN_NAME':'db_main_name',
	'URN_DB_TRASH_NAME':'db_trash_name',
	'URN_DB_LOG_NAME':'db_log_name',
	'URN_JWT_PRIVATE_KEY':'jwt_private_key',
	'URN_ENCRYPTION_ROUND':'encryption_rounds',
	'URN_MAX_PASSWORD_LENGTH':'max_password_length',
	'URN_STORAGE':'storage',
	'URN_AWS_BUCKET_NAME':'aws_bucket_name',
	'URN_AWS_BUCKET_REGION':'aws_bucket_region',
	'URN_AWS_USER_ACCESS_KEY_ID':'aws_user_access_key_id',
	'URN_AWS_USER_SECRET_ACCESS_KEY':'aws_user_secret_access_key',
	'URN_CONNECT_ON_INIT':'connect_on_init',
};

const env_strings:EnvVarName[] = [
	'URN_DB_TYPE',
	'URN_MONGO_MAIN_CONNECTION',
	'URN_MONGO_TRASH_CONNECTION',
	'URN_MONGO_LOG_CONNECTION',
	'URN_DB_MAIN_NAME',
	'URN_DB_TRASH_NAME',
	'URN_DB_LOG_NAME',
	'URN_JWT_PRIVATE_KEY',
	'URN_STORAGE',
	'URN_AWS_BUCKET_NAME',
	'URN_AWS_BUCKET_REGION',
	'URN_AWS_USER_ACCESS_KEY_ID',
	'URN_AWS_USER_SECRET_ACCESS_KEY'
];

const env_integers:EnvVarName[] = [
];

const env_floats:EnvVarName[] = [
];

const env_naturals:EnvVarName[] = [
	'URN_ENCRYPTION_ROUND',
	'URN_MAX_PASSWORD_LENGTH',
];

const env_booleans:EnvVarName[] = [
	'URN_CONNECT_ON_INIT'
];

export const env_vars_by_type:EnvVarsByType = {
	'string': env_strings,
	'integer': env_integers,
	'float': env_floats,
	'natural': env_naturals,
	'boolean': env_booleans
};
