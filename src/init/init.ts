/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('INIT_CORE_MODULE', `Core init module`);

// import schema from 'uranio-schema';

import {schema} from '../sch/';

import {core_config} from '../conf/defaults';

import * as types from '../types';

import * as conf from '../conf/';

import * as book from '../book/';

import * as db from '../db/';

import * as bll from '../bll/';

export function init(config?:types.Configuration)
		:void{
	if(typeof config === 'undefined'){
		conf.set_from_env(core_config);
	}else{
		conf.set(core_config, config);
	}
	_validate_core_variables();
	_validate_core_book();
	
	conf.set_initialize(true);
	
	_core_connect();
	
	if(conf.get(`superuser_create_on_init`) === true){
		_create_superuser();
	}
	
}

async function _create_superuser(){
	const auth_bll = bll.auth.create('superuser');
	try{
		
		await auth_bll.authenticate(core_config.superuser_email, core_config.superuser_password);
		urn_log.debug(`Main superuser [${core_config.superuser_email}] already in database.`);
		
	}catch(err){ // cannot auth with config email and password
		const bll_superuser = bll.basic.create('superuser');
		try{
			const one_su = await bll_superuser.find_one({email: core_config.superuser_email});
			urn_log.warn(`Main superuser [${core_config.superuser_email}] already in database but with wrong password.`);
			await bll_superuser.remove_by_id(one_su._id);
			urn_log.debug(`Main superuser [${core_config.superuser_email}] deleted.`);
			// eslint-disable-next-line
		}catch(err){} // If there is no user it throws an error, but nothing should be done.
		const superuser_shape = {
			email: core_config.superuser_email,
			password: core_config.superuser_password,
			groups: []
		};
		const superuser = await bll_superuser.insert_new(superuser_shape);
		
		const bll_group = bll.basic.create('group');
		const group = await bll_group.insert_new({name: superuser.email});
		
		superuser.groups = [group._id];
		await bll_superuser.update_one(superuser);
		
		urn_log.debug(`Main superuser [${core_config.superuser_email}] [${superuser._id}] created.`);
	}
}

function _core_connect(){
	if(conf.get(`connect_on_init`) === true){
		db.connect();
	}
}

/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_core_book(){
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
	const atom_defs = book.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		if(atom_def && atom_def.authenticate === true){
			const properties = book.get_all_property_definitions(atom_name as schema.AtomName);
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
				if(properties.email.type !== types.BookProperty.EMAIL){
					throw urn_exc.create_invalid_book(
						`INVALID_AUTH_ATOM_TYPE_EMAIL`,
						`Auth Atom \`${atom_name}.email\` must be of type types.BookProperty.EMAIL.`
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
				if(properties.password.type !== types.BookProperty.ENCRYPTED){
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
				if(properties.groups.type !== types.BookProperty.ATOM_ARRAY){
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
	const atom_defs = book.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		connection_by_atom[atom_name] = 'main';
		if(atom_def && typeof atom_def.connection === 'string'){
			connection_by_atom[atom_name] = atom_def.connection;
		}
	}
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		if(!atom_def){
			continue;
		}
		for(const [_prop_key, prop_def] of Object.entries(atom_def.properties)){
			if(
				(
					prop_def.type === types.BookProperty.ATOM
					|| prop_def.type === types.BookProperty.ATOM_ARRAY
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
	const atom_defs = book.get_all_definitions();
	const not_public_atoms = [];
	for(const [atom_name, atom_def] of Object.entries(atom_defs)){
		if(
			atom_def
			&& typeof atom_def.security !== 'string'
			&& atom_def.security?.type === types.BookSecurity.UNIFORM
			&& typeof atom_def.security?._r !== 'undefined'
		){
			not_public_atoms.push(atom_name);
		}
	}
	for(const [parent_atom_name, parent_atom_def] of Object.entries(atom_defs)){
		if(!parent_atom_def){
			continue;
		}
		const prop_defs = parent_atom_def.properties;
		for(const [prop_key, prop_def] of Object.entries(prop_defs)){
			if(
				(
					prop_def.type === types.BookProperty.ATOM
					|| prop_def.type === types.BookProperty.ATOM_ARRAY
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

function _validate_core_variables(){
	_check_if_jwt_key_has_changed();
	_check_if_db_names_have_changed();
	_check_if_db_connections_were_set();
	_check_if_db_connections_were_set();
	_check_if_superuser_was_set();
	_check_if_storage_params_were_set();
	_check_number_values();
}

function _check_number_values(){
	if(core_config.max_password_length >= 60){
		throw urn_exc.create_not_initialized(
			`INVALID_MAX_PASSWORD_LENGHT`,
			`Config max_password_lenght value cannot be greater than 59.`
		);
	}
	if(core_config.encryption_rounds < 0){
		throw urn_exc.create_not_initialized(
			`INVALID_ENCRYPTION_ROUNDS`,
			`Config encryption_rounds must be a natural number.`
		);
	}
	if(core_config.max_query_depth_allowed < 0){
		throw urn_exc.create_not_initialized(
			`INVALID_MAX_QUERY_DEPTH_ALLOWED`,
			`Config max_query_depth_allowed must be a natural number.`
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

function _check_if_superuser_was_set(){
	if(core_config.superuser_email === ''){
		urn_log.warn(`Invalid superuser email.`);
	}
	if(core_config.superuser_password === ''){
		urn_log.warn(`Invalid superuser password.`);
	}
}
