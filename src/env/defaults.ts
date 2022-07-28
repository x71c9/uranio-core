/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {Environment} from '../typ/env';

export const core_env:Required<Environment> = {
	
	// production: process.env.NODE_ENV === 'production',
	
	log_level: urn_log.LogLevel.ERROR,
	
	// dev_log_level: urn_log.LogLevel.DEBUG,
	
	mongo_main_connection: '',
	
	mongo_trash_connection: '',
	
	mongo_log_connection: '',
	
	// This must be the same in _check_if_db_names_were_changed method in conf module
	db_main_name: 'uranio_dev',
	
	// This must be the same in _check_if_db_names_were_changed method in conf module
	db_trash_name: 'uranio_trash_dev',
	
	// This must be the same in _check_if_db_names_were_changed method in conf module
	db_log_name: 'uranio_log_dev',
	
	superuser_email: '',
	
	superuser_password: '',
	
	// superuser_create_on_init: true,
	
	// This must be the same in _check_if_jwt_was_changed method in conf module
	jwt_private_key: 'A_KEY_THAT_NEED_TO_BE_CHANGED',
	
	aws_bucket_name: '',
	
	aws_bucket_region: '',
	
	aws_user_access_key_id: '',
	
	aws_user_secret_access_key: ''
	
};
