/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('INIT_MODULE', `Init module`);

import {core_config} from '../conf/defaults';

import {env_vars_by_type, core_config_by_env} from '../conf/env';

import {BookSecurityType} from '../typ/book_srv';

import {BookPropertyType} from '../typ/common';

import * as types from '../types';

import * as conf from '../conf/';

import * as book from '../book/';

import * as db from '../db/';

let _is_uranio_initialized = false;

export function is_initialized():boolean{
	return _is_uranio_initialized;
}

export function init(config?:types.Configuration)
		:void{
	if(typeof config === 'undefined'){
		_set_variable_from_environment();
	}else{
		_set_variable(config);
	}
	_validate_variables();
	_validate_book();
	
	_set_initialize();
	
	_connect();
}

function _set_initialize(){
	_is_uranio_initialized = true;
}

function _connect(){
	if(conf.get(`connect_on_init`) === true){
		db.connect();
	}
}

/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_book(){
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
			const properties = book.atom.get_all_property_definitions(atom_name as types.AtomName);
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

function _validate_variables(){
	_check_if_jwt_key_has_changed();
	_check_if_db_names_have_changed();
	_check_if_db_connections_were_set();
	_check_if_storage_params_were_set();
	_check_max_password_length();
}

function _check_max_password_length(){
	if(core_config.max_password_length >= 60){
		throw urn_exc.create_not_initialized(
			`INVALID_MAX_PASSWORD_LENGHT`,
			`Config max_password_lenght value cannot be greater than 59.`
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
					`Invalid config aws_bucket_name.`
				);
			}
			if(
				typeof core_config.aws_bucket_region !== 'string'
				|| core_config.aws_bucket_region === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_BUCKET_REGION`,
					`Invalid config aws_bucket_region.`
				);
			}
			if(
				typeof core_config.aws_user_access_key_id !== 'string'
				|| core_config.aws_user_access_key_id === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_USER_ACCESS_KEY`,
					`Invalid config aws_user_access_key.`
				);
			}
			if(
				typeof core_config.aws_user_secret_access_key !== 'string'
				|| core_config.aws_user_secret_access_key === ''
			){
				throw urn_exc.create_not_initialized(
					`INVALID_AWS_USER_SECRET_ACCESS_KEY`,
					`Invalid config aws_user_secret_access_key.`
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

function _check_if_db_names_have_changed(){
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

function _check_if_jwt_key_has_changed(){
	if(core_config.jwt_private_key === 'A_KEY_THAT_NEED_TO_BE_CHANGED'){
		throw urn_exc.create_not_initialized(
			`JWT_KEY_NOT_CHANGED`,
			`You must changed the value of jwt key for encryption.`
		);
	}
}

function _set_variable(config:types.Configuration):void{
	Object.assign(core_config, config);
}

function _set_variable_from_environment():void{
	for(const [env_type, env_vars] of Object.entries(env_vars_by_type)){
		for(const env_var of env_vars){
			switch(env_type as keyof typeof env_vars_by_type){
				case 'natural':{
					if(
						typeof process.env[env_var] === 'number'
						|| typeof process.env[env_var] === 'string'
						&& process.env[env_var] !== ''
					){
						(core_config as any)[core_config_by_env[env_var]] =
							Math.max(parseInt(process.env[env_var]!),0);
					}
					break;
				}
				case 'integer':{
					if(
						typeof process.env[env_var] === 'number'
						|| typeof process.env[env_var] === 'string'
						&& process.env[env_var] !== ''
					){
						(core_config as any)[core_config_by_env[env_var]] =
							parseInt(process.env[env_var] as any);
					}
					break;
				}
				case 'float':{
					if(
						typeof process.env[env_var] === 'number'
						|| typeof process.env[env_var] === 'string'
						&& process.env[env_var] !== ''
					){
						(core_config as any)[core_config_by_env[env_var]] =
							parseFloat(process.env[env_var] as any);
					}
					break;
				}
				case 'boolean':{
					if(
						typeof process.env[env_var] === 'boolean'
						|| typeof process.env[env_var] === 'string'
						&& process.env[env_var] !== ''
					){
						(core_config as any)[core_config_by_env[env_var]] =
							(process.env[env_var] === 'true') || (process.env[env_var] as any === true);
					}
					break;
				}
				case 'string':{
					if(
						typeof process.env[env_var] === 'string'
						&& process.env[env_var] !== ''
					){
						(core_config as any)[core_config_by_env[env_var]] = process.env[env_var];
					}
					break;
				}
			}
		}
	}
}

