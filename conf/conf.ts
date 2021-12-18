/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception, urn_log} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_MODULE', `Configuration module`);

import {core_config} from './defaults';

import {AtomName} from '../typ/atom';

import {
	FullConfiguration,
	Configuration,
	DatabaseType,
	StorageType
} from '../typ/conf';

import {BookSecurityType} from '../typ/book_srv';

import {BookPropertyType} from '../typ/common';

import * as book from '../book/';

import * as db from '../db/';

// import {BLL} from '../bll/';

let _uranio_is_initialized = false;

export function initialize(config:Configuration):void{
	Object.assign(core_config, config);
	_validate_uranio();
	_connect();
}

export function initialize_from_environment():void{
	_set_conf_from_env_variable();
	_validate_uranio();
	_connect();
}

export function get<k extends keyof FullConfiguration>(param_name:k)
		:typeof core_config[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_config[param_name];
}

function _connect(){
	if(get(`connect_on_init`) === true){
		db.connect();
	}
}

function _validate_uranio(){
	_book_validation();
	_check_if_jwt_key_was_changed();
	_check_if_db_names_were_changed();
	_check_if_db_connections_were_set();
	_check_if_storage_params_were_set();
	_check_max_password_length();
	_uranio_is_initialized = true;
}

function _set_conf_from_env_variable(){
	if(
		typeof process.env.URN_DB_TYPE === 'string'
		&& process.env.URN_DB_TYPE !== ''
	){
		core_config.db_type = process.env.URN_DB_TYPE as DatabaseType;
	}
	if(
		typeof process.env.URN_MONGO_MAIN_CONNECTION === 'string'
		&& process.env.URN_MONGO_MAIN_CONNECTION !== ''
	){
		core_config.mongo_main_connection = process.env.URN_MONGO_MAIN_CONNECTION;
	}
	if(
		typeof process.env.URN_MONGO_TRASH_CONNECTION === 'string'
		&& process.env.URN_MONGO_TRASH_CONNECTION !== ''
	){
		core_config.mongo_trash_connection = process.env.URN_MONGO_TRASH_CONNECTION;
	}
	if(
		typeof process.env.URN_MONGO_LOG_CONNECTION === 'string'
		&& process.env.URN_MONGO_LOG_CONNECTION !== ''
	){
		core_config.mongo_log_connection = process.env.URN_MONGO_LOG_CONNECTION;
	}
	if(
		typeof process.env.URN_DB_MAIN_NAME === 'string'
		&& process.env.URN_DB_MAIN_NAME !== ''
	){
		core_config.db_main_name = process.env.URN_DB_MAIN_NAME;
	}
	if(
		typeof process.env.URN_DB_TRASH_NAME === 'string'
		&& process.env.URN_DB_TRASH_NAME !== ''
	){
		core_config.db_trash_name = process.env.URN_DB_TRASH_NAME;
	}
	if(
		typeof process.env.URN_DB_LOG_NAME === 'string'
		&& process.env.URN_DB_LOG_NAME !== ''
	){
		core_config.db_log_name = process.env.URN_DB_LOG_NAME;
	}
	if(
		typeof process.env.URN_JWT_PRIVATE_KEY === 'string'
		&& process.env.URN_JWT_PRIVATE_KEY !== ''
	){
		core_config.jwt_private_key = process.env.URN_JWT_PRIVATE_KEY;
	}
	if(
		typeof process.env.URN_ENCRYPTION_ROUNDS === 'number'
		|| typeof process.env.URN_ENCRYPTION_ROUNDS === 'string'
		&& process.env.URN_ENCRYPTION_ROUNDS !== ''
	){
		core_config.encryption_rounds = Math.max(parseInt(process.env.URN_ENCRYPTION_ROUNDS),0);
	}
	if(
		typeof process.env.URN_MAX_PASSWORD_LENGTH === 'number'
		|| typeof process.env.URN_MAX_PASSWORD_LENGTH === 'string'
		&& process.env.URN_MAX_PASSWORD_LENGTH !== ''
	){
		core_config.max_password_length = Math.max(parseInt(process.env.URN_MAX_PASSWORD_LENGTH),0);
	}
	if(
		typeof process.env.URN_STORAGE === 'string'
		&& process.env.URN_STORAGE !== ''
	){
		core_config.storage = process.env.URN_STORAGE as StorageType;
	}
	if(
		typeof process.env.URN_AWS_BUCKET_NAME === 'string'
		&& process.env.URN_AWS_BUCKET_NAME !== ''
	){
		core_config.aws_bucket_name = process.env.URN_AWS_BUCKET_NAME;
	}
	if(
		typeof process.env.URN_AWS_BUCKET_REGION === 'string'
		&& process.env.URN_AWS_BUCKET_REGION !== ''
	){
		core_config.aws_bucket_region = process.env.URN_AWS_BUCKET_REGION;
	}
	if(
		typeof process.env.URN_AWS_USER_ACCESS_KEY_ID === 'string'
		&& process.env.URN_AWS_USER_ACCESS_KEY_ID !== ''
	){
		core_config.aws_user_access_key_id = process.env.URN_AWS_USER_ACCESS_KEY_ID;
	}
	if(
		typeof process.env.URN_AWS_USER_SECRET_ACCESS_KEY === 'string'
		&& process.env.URN_AWS_USER_SECRET_ACCESS_KEY !== ''
	){
		core_config.aws_user_secret_access_key = process.env.URN_AWS_USER_SECRET_ACCESS_KEY;
	}
	if(
		typeof process.env.URN_CONNECT_ON_INIT === 'boolean'
		|| typeof process.env.URN_CONNECT_ON_INIT === 'string'
		&& process.env.URN_CONNECT_ON_INIT !== ''
	){
		core_config.connect_on_init = !!process.env.URN_CONNECT_ON_INIT;
	}
}

function _check_if_uranio_was_initialized(){
	if(_uranio_is_initialized === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}

function _check_max_password_length(){
	if(core_config.max_password_length >= 60){
		throw urn_exc.create_not_initialized(
			`INVALID_MAX_PASSWORD_LENGHT`,
			`max_password_lenght value cannot be greater than 59.`
		);
	}
}

function _check_if_storage_params_were_set(){
	switch(core_config.storage){
		case 'aws':{
			if(
				typeof core_config.aws_bucket_name !== 'string'
				|| core_config.aws_bucket_name === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_BUCKET_NAME`,
					`Invalid aws bucket name.`
				);
			}
			if(
				typeof core_config.aws_bucket_region !== 'string'
				|| core_config.aws_bucket_region === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_BUCKET_REGION`,
					`Invalid aws bucket region.`
				);
			}
			if(
				typeof core_config.aws_user_access_key_id !== 'string'
				|| core_config.aws_user_access_key_id === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_USER_ACCESS_KEY`,
					`Invalid aws user access key.`
				);
			}
			if(
				typeof core_config.aws_user_secret_access_key !== 'string'
				|| core_config.aws_user_secret_access_key === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_USER_SECRET_ACCESS_KEY`,
					`Invalid aws user secret access key.`
				);
			}
		}
	}
}

function _check_if_db_connections_were_set(){
	switch(core_config.db_type){
		case 'mongo':{
			if(core_config.mongo_main_connection === ''){
				throw urn_exc.create_not_initialized(
					`MISSING_MONGO_MAIN_CONNECTION`,
					`Missing mongo_main_connection in core_config.`
				);
			}
			if(core_config.mongo_trash_connection === ''){
				urn_log.warn(`You didn't set mongo_trash_connection.`);
			}
			if(core_config.mongo_log_connection === ''){
				urn_log.warn(`You didn't set mongo_log_connection.`);
			}
			break;
		}
	}
}

/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _book_validation(){
	_validate_acl_reference_consistency();
	_validate_atoms_reference_on_the_same_connection();
	_validate_auth_atoms();
	_validate_bll_classes();
	_validate_on_errors();
	// _validate_atom_hard_properties();
	// _validate_dock_url_uniqueness();
	// _validate_route_name();
}

/*
 * on_error shouldn't call any server function
 */
function _validate_on_errors(){
	// TODO
	// Maybe check with ts-morph if the function is `async`?
}

/**
 * TODO:
 * Is this possible?
 * bll.class must be a function that return a BLL class.
 */
function _validate_bll_classes(){
	// const bll_defs = book.bll.get_all_definitions();
	// for(const [atom_name, bll_def] of Object.entries(bll_defs)){
	//   if(
	//     typeof bll_def.class !== 'function'
	//     || !(bll_def.class() instanceof BLL)
	//   ){
	//     throw urn_exc.create_invalid_book(
	//       `INVALID_BLL_CLASS`,
	//       `Atom \`${atom_name}\` has an invalid \`bll\` definition.` +
	//       ` \`${atom_name}.bll.class\` must be a function that return a BLL class.`
	//     );
	//   }
	// }
}

/*
 * Check if AuthAtom have email, password and groups non-optional.
 */
function _validate_auth_atoms(){
	const atom_defs = book.atom.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		if(atom_def.authenticate === true){
			const properties = book.atom.get_all_property_definitions(atom_name as AtomName);
			if(typeof properties.email !== 'object'){
				throw urn_exc.create_invalid_book(
					`INVALID_AUTH_ATOM_MISSING_EMAIL`,
					`Auth Atom \`${atom_name}\` must have an \`email\` property.`
				);
			}else{
				if(properties.email.optional === false){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_OPTIONAL_EMAIL`,
						`Auth Atom \`${atom_name}.email\` cannot be optional.`
					);
				}
				if(properties.email.type !== BookPropertyType.EMAIL){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_TYPE_EMAIL`,
						`Auth Atom \`${atom_name}.email\` must be of type BookPropertyType.EMAIL.`
					);
				}
			}
			if(typeof properties.password !== 'object'){
				throw urn_exc.create_invalid_book(
					`INVALID_AUTH_ATOM_MISSING_PASSWORD`,
					`Auth Atom \`${atom_name}\` must have a \`password\` property.`
				);
			}else{
				if(properties.password.optional === false){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_OPTIONAL_PASSWORD`,
						`Auth Atom \`${atom_name}.password\` cannot be optional.`
					);
				}
				if(properties.password.type !== BookPropertyType.ENCRYPTED){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_TYPE_PASSWORD`,
						`Auth Atom \`${atom_name}.password\` must be of type BookPropertyType.ENCRYPTED.`
					);
				}
			}
			if(typeof properties.groups !== 'object'){
				throw urn_exc.create_invalid_book(
					`INVALID_AUTH_ATOM_MISSING_GROUP`,
					`Auth Atom \`${atom_name}\` must have a \`group\` property.`
				);
			}else{
				if(properties.groups.optional === false){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_OPTIONAL_GROUP`,
						`Auth Atom \`${atom_name}.group\` cannot be optional.`
					);
				}
				if(properties.groups.type !== BookPropertyType.ATOM_ARRAY){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_TYPE_GROUP`,
						`Auth Atom \`${atom_name}.group\` must be of type BookPropertyType.ATOM_ARRAY.`
					);
				}else if(properties.groups.atom !== 'group'){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_GROUP_ATOM`,
						`Auth Atom \`${atom_name}.group\` must be of referencing atom \`group\`.` +
						` Now it is referencing atom \`${properties.groups.atom}\``
					);
				}
			}
		}
	}
}

type ConnectionByAtom = {
	[k:string]: string
}
function _validate_atoms_reference_on_the_same_connection(){
	const connection_by_atom = {} as ConnectionByAtom;
	const atom_defs = book.atom.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		connection_by_atom[atom_name] = atom_def.connection || 'main';
	}
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		for(const [_prop_key, prop_def] of Object.entries(atom_def.properties)){
			if(
				(
					prop_def.type === BookPropertyType.ATOM
					|| prop_def.type === BookPropertyType.ATOM_ARRAY
				)
				&& connection_by_atom[prop_def.atom] !== connection_by_atom[atom_name]
			){
				throw urn_exc.create_invalid_book(
					`INCONSISTENT_BOOK_PERMISSIONS`,
					`Atom references must be on the same connection.` +
					` \`${prop_def.atom}\` must be on the same connection of \`${atom_name}\`.`
				);
			}
		}
	}
}

/*
 * In order to make the access control layer works:
 *
 * If an atom has security type UNIFORM and `_r !== undefined`, meaning that all
 * atoms are not PUBLIC for reading -> all the references of it as subatom
 * must be optional in the case it cannot be accessible by the user.
 */
function _validate_acl_reference_consistency(){
	const atom_defs = book.atom.get_all_definitions();
	const not_public_atoms = [];
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		if(
			typeof atom_def.security !== 'string'
			&& atom_def.security?.type === BookSecurityType.UNIFORM
			&& typeof atom_def.security?._r !== 'undefined'
		){
			not_public_atoms.push(atom_name);
		}
	}
	for(const [parent_atom_name, parent_atom_def] of Object.entries(atom_defs)){
		const prop_defs = parent_atom_def.properties;
		for(const [prop_key, prop_def] of Object.entries(prop_defs)){
			if(
				(
					prop_def.type === BookPropertyType.ATOM
					|| prop_def.type === BookPropertyType.ATOM_ARRAY
				)
				&& not_public_atoms.includes(prop_def.atom)
				&& prop_def.optional !== true
			){
				throw urn_exc.create_invalid_book(
					`INCONSISTENT_BOOK_PERMISSIONS`,
					`Since Atom \`${prop_def.atom}\` is not public,` +
					` all its references must be optional.` +
					` ${parent_atom_name}.${prop_key} must be optional.`
				);
			}
		}
	}
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(core_config, param_name);
}

function _check_if_db_names_were_changed(){
	if(core_config.db_main_name === 'uranio_dev'){
		urn_log.warn(`You are using default value for db_main_name [uranio_dev].`);
	}
	if(core_config.db_trash_name === 'uranio_trash_dev'){
		urn_log.warn(`You are using default value for db_trash_name [uranio_trash_dev].`);
	}
	if(core_config.db_log_name === 'uranio_log_dev'){
		urn_log.warn(`You are using default value for db_log_name [uranio_log_dev].`);
	}
}

function _check_if_jwt_key_was_changed(){
	if(core_config.jwt_private_key === 'A_KEY_THAT_NEED_TO_BE_CHANGED'){
		throw urn_exc.create_not_initialized(
			`JWT_KEY_NOT_CHANGED`,
			`You must changed the value of jwt key for encryption`
		);
	}
}
