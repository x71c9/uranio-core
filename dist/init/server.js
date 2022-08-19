"use strict";
/**
 * Init module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CORE_INIT_MODULE', `Core init module`);
const defaults_1 = require("../conf/defaults");
const defaults_2 = require("../env/defaults");
const required = __importStar(require("../req/server"));
const register = __importStar(require("../reg/server"));
const types = __importStar(require("../server/types"));
const conf = __importStar(require("../conf/server"));
const env = __importStar(require("../env/server"));
const book = __importStar(require("../book/server"));
const db = __importStar(require("../db/server"));
const bll = __importStar(require("../bll/server"));
const log = __importStar(require("../log/server"));
const util = __importStar(require("../util/server"));
const state_1 = require("./state");
function init(config, register_required = true) {
    conf.set(util.toml.read(defaults_1.core_config));
    env.set_env();
    log.init(urn_lib_1.urn_log);
    if (config) {
        conf.set(config);
    }
    if (register_required) {
        _register_required_atoms();
    }
    _validate_core_variables();
    _validate_core_book();
    _core_connect();
    _create_superuser();
    (0, state_1.check_and_set_init_state)();
    urn_lib_1.urn_log.trace(`Uranio core initialization completed.`);
}
exports.init = init;
function _register_required_atoms() {
    const required_atoms = required.get();
    for (const [atom_name, atom_def] of Object.entries(required_atoms)) {
        register.atom(atom_def, atom_name);
    }
}
async function _create_superuser() {
    if (conf.get('default_atoms_superuser') === false) {
        return;
    }
    if (!conf.get(`superuser_create_on_init`) === true) {
        return;
    }
    const auth_bll = bll.auth.create('_superuser');
    try {
        await auth_bll.authenticate(defaults_2.core_env.superuser_email, defaults_2.core_env.superuser_password);
        urn_lib_1.urn_log.debug(`Main _superuser [${defaults_2.core_env.superuser_email}] already in database.`);
    }
    catch (err) { // cannot auth with config email and password
        const bll_superuser = bll.basic.create('_superuser');
        try {
            const one_su = await bll_superuser.find_one({ email: defaults_2.core_env.superuser_email });
            urn_lib_1.urn_log.warn(`Main _superuser [${defaults_2.core_env.superuser_email}] already in database but with wrong password.`);
            await bll_superuser.remove_by_id(one_su._id);
            urn_lib_1.urn_log.debug(`Main _superuser [${defaults_2.core_env.superuser_email}] deleted.`);
            // eslint-disable-next-line
        }
        catch (err) { } // If there is no user it throws an error, but nothing should be done.
        const superuser_shape = {
            email: defaults_2.core_env.superuser_email,
            password: defaults_2.core_env.superuser_password,
            groups: []
        };
        const superuser = await bll_superuser.insert_new(superuser_shape);
        const bll_group = bll.basic.create('_group');
        const group = await bll_group.insert_new({ name: superuser.email });
        superuser.groups = [group._id];
        await bll_superuser.update_one(superuser);
        urn_lib_1.urn_log.debug(`Main _superuser [${defaults_2.core_env.superuser_email}] [${superuser._id}] created.`);
    }
}
function _core_connect() {
    if (conf.get(`connect_on_init`) === true) {
        db.connect();
    }
}
/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_core_book() {
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
function _validate_on_errors() {
    // TODO
    // Maybe check with ts-morph if the function is `async`?
}
/**
 * TODO:
 * Is this possible?
 * bll.class must be a function that return a BLL class.
 */
function _validate_bll_classes() {
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
function _validate_auth_atoms() {
    const atom_defs = book.get_all_definitions();
    for (const [atom_name, atom_def] of Object.entries(atom_defs)) {
        if (atom_def && atom_def.authenticate === true) {
            const properties = book.get_properties_definition(atom_name);
            if (typeof properties.email !== 'object') {
                throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_MISSING_EMAIL`, `Auth Atom \`${atom_name}\` must have an \`email\` property.`);
            }
            else {
                if (properties.email.optional === false) {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_OPTIONAL_EMAIL`, `Auth Atom \`${atom_name}.email\` cannot be optional.`);
                }
                if (properties.email.type !== types.PropertyType.EMAIL) {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_TYPE_EMAIL`, `Auth Atom \`${atom_name}.email\` must be of type types.PropertyType.EMAIL.`);
                }
            }
            if (typeof properties.password !== 'object') {
                throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_MISSING_PASSWORD`, `Auth Atom \`${atom_name}\` must have a \`password\` property.`);
            }
            else {
                if (properties.password.optional === false) {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_OPTIONAL_PASSWORD`, `Auth Atom \`${atom_name}.password\` cannot be optional.`);
                }
                if (properties.password.type !== types.PropertyType.ENCRYPTED) {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_TYPE_PASSWORD`, `Auth Atom \`${atom_name}.password\` must be of type PropertyType.ENCRYPTED.`);
                }
            }
            if (typeof properties.groups !== 'object') {
                throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_MISSING_GROUP`, `Auth Atom \`${atom_name}\` must have a \`group\` property.`);
            }
            else {
                if (properties.groups.optional === false) {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_OPTIONAL_GROUP`, `Auth Atom \`${atom_name}.group\` cannot be optional.`);
                }
                if (properties.groups.type !== types.PropertyType.ATOM_ARRAY) {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_TYPE_GROUP`, `Auth Atom \`${atom_name}.group\` must be of type PropertyType.ATOM_ARRAY.`);
                }
                else if (properties.groups.atom !== '_group') {
                    throw urn_exc.create_invalid_book(`INVALID_AUTH_ATOM_GROUP_ATOM`, `Auth Atom \`${atom_name}.group\` must be of referencing atom \`_group\`.` +
                        ` Now it is referencing atom \`${properties.groups.atom}\``);
                }
            }
        }
    }
}
function _validate_atoms_reference_on_the_same_connection() {
    const connection_by_atom = {};
    const atom_defs = book.get_all_definitions();
    for (const [atom_name, atom_def] of Object.entries(atom_defs)) {
        connection_by_atom[atom_name] = 'main';
        if (atom_def && typeof atom_def.connection === 'string') {
            connection_by_atom[atom_name] = atom_def.connection;
        }
    }
    for (const [atom_name, atom_def] of Object.entries(atom_defs)) {
        if (!atom_def) {
            continue;
        }
        for (const [_prop_key, prop_def] of Object.entries(atom_def.properties)) {
            if ((prop_def.type === types.PropertyType.ATOM
                || prop_def.type === types.PropertyType.ATOM_ARRAY)
                && connection_by_atom[prop_def.atom] !== connection_by_atom[atom_name]) {
                throw urn_exc.create_invalid_book(`INCONSISTENT_BOOK_PERMISSIONS`, `Atom references must be on the same connection.` +
                    ` \`${prop_def.atom}\` must be on the same connection of \`${atom_name}\`.`);
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
function _validate_acl_reference_consistency() {
    var _a, _b;
    const atom_defs = book.get_all_definitions();
    const not_public_atoms = [];
    for (const [atom_name, atom_def] of Object.entries(atom_defs)) {
        if (atom_def
            && typeof atom_def.security !== 'string'
            && ((_a = atom_def.security) === null || _a === void 0 ? void 0 : _a.type) === types.SecurityType.UNIFORM
            && typeof ((_b = atom_def.security) === null || _b === void 0 ? void 0 : _b._r) !== 'undefined') {
            not_public_atoms.push(atom_name);
        }
    }
    for (const [parent_atom_name, parent_atom_def] of Object.entries(atom_defs)) {
        if (!parent_atom_def) {
            continue;
        }
        const prop_defs = parent_atom_def.properties;
        for (const [prop_key, prop_def] of Object.entries(prop_defs)) {
            if ((prop_def.type === types.PropertyType.ATOM
                || prop_def.type === types.PropertyType.ATOM_ARRAY)
                && not_public_atoms.includes(prop_def.atom)
                && prop_def.optional !== true) {
                throw urn_exc.create_invalid_book(`INCONSISTENT_BOOK_PERMISSIONS`, `Since Atom \`${prop_def.atom}\` is not public,` +
                    ` all its references must be optional.` +
                    ` ${parent_atom_name}.${prop_key} must be optional.`);
            }
        }
    }
}
function _validate_core_variables() {
    _check_if_jwt_key_has_changed();
    _check_if_db_names_have_changed();
    _check_if_db_connections_were_set();
    _check_if_db_connections_were_set();
    _check_if_superuser_was_set();
    _check_if_storage_params_were_set();
    _check_number_values();
    _check_if_atom_group_is_needed();
}
function _check_number_values() {
    if (defaults_1.core_config.max_password_length >= 60) {
        throw urn_exc.create_not_initialized(`INVALID_MAX_PASSWORD_LENGHT`, `Config max_password_lenght value cannot be greater than 59.`);
    }
    if (defaults_1.core_config.encryption_rounds < 0) {
        throw urn_exc.create_not_initialized(`INVALID_ENCRYPTION_ROUNDS`, `Config encryption_rounds must be a natural number.`);
    }
    if (defaults_1.core_config.max_query_depth_allowed < 0) {
        throw urn_exc.create_not_initialized(`INVALID_MAX_QUERY_DEPTH_ALLOWED`, `Config max_query_depth_allowed must be a natural number.`);
    }
}
function _check_if_storage_params_were_set() {
    switch (defaults_1.core_config.storage) {
        case 'aws': {
            if (typeof defaults_2.core_env.aws_bucket_name !== 'string'
                || defaults_2.core_env.aws_bucket_name === '') {
                throw urn_exc.create_not_initialized(`INVALID_AWS_BUCKET_NAME`, `Invalid config aws_bucket_name.`);
            }
            if (typeof defaults_2.core_env.aws_bucket_region !== 'string'
                || defaults_2.core_env.aws_bucket_region === '') {
                throw urn_exc.create_not_initialized(`INVALID_AWS_BUCKET_REGION`, `Invalid config aws_bucket_region.`);
            }
            if (typeof defaults_2.core_env.aws_user_access_key_id !== 'string'
                || defaults_2.core_env.aws_user_access_key_id === '') {
                throw urn_exc.create_not_initialized(`INVALID_AWS_USER_ACCESS_KEY`, `Invalid config aws_user_access_key.`);
            }
            if (typeof defaults_2.core_env.aws_user_secret_access_key !== 'string'
                || defaults_2.core_env.aws_user_secret_access_key === '') {
                throw urn_exc.create_not_initialized(`INVALID_AWS_USER_SECRET_ACCESS_KEY`, `Invalid config aws_user_secret_access_key.`);
            }
        }
    }
}
function _check_if_db_connections_were_set() {
    switch (defaults_1.core_config.db) {
        case 'mongo': {
            if (defaults_2.core_env.mongo_main_connection === '') {
                throw urn_exc.create_not_initialized(`MISSING_MONGO_MAIN_CONNECTION`, `Missing mongo_main_connection in core_env.`);
            }
            if (defaults_2.core_env.mongo_trash_connection === '') {
                urn_lib_1.urn_log.warn(`You didn't set mongo_trash_connection.`);
            }
            if (defaults_2.core_env.mongo_log_connection === '') {
                urn_lib_1.urn_log.warn(`You didn't set mongo_log_connection.`);
            }
            break;
        }
    }
}
function _check_if_db_names_have_changed() {
    if (defaults_2.core_env.db_main_name === 'uranio_dev') {
        urn_lib_1.urn_log.warn(`You are using default value for db_main_name [uranio_dev].`);
    }
    if (defaults_2.core_env.db_trash_name === 'uranio_trash_dev') {
        urn_lib_1.urn_log.warn(`You are using default value for db_trash_name [uranio_trash_dev].`);
    }
    if (defaults_2.core_env.db_log_name === 'uranio_log_dev') {
        urn_lib_1.urn_log.warn(`You are using default value for db_log_name [uranio_log_dev].`);
    }
}
function _check_if_jwt_key_has_changed() {
    if (defaults_2.core_env.jwt_private_key === 'A_KEY_THAT_NEED_TO_BE_CHANGED') {
        throw urn_exc.create_not_initialized(`JWT_KEY_NOT_CHANGED`, `You must changed the value of jwt key for encryption.`);
    }
}
function _check_if_superuser_was_set() {
    if (conf.get('default_atoms_superuser') === false) {
        return;
    }
    if (defaults_2.core_env.superuser_email === '') {
        urn_lib_1.urn_log.warn(`Invalid _superuser email.`);
    }
    if (defaults_2.core_env.superuser_password === '') {
        urn_lib_1.urn_log.warn(`Invalid _superuser password.`);
    }
}
function _check_if_atom_group_is_needed() {
    if (defaults_1.core_config.default_atoms_superuser === true || defaults_1.core_config.default_atoms_user === true) {
        if (defaults_1.core_config.default_atoms_group === false) {
            throw urn_exc.create_not_initialized(`ATOM_GROUP_IS_NEEDED`, `If default Atoms \`_superuser\` or \`user\` are defined,` +
                `Atom \`_group\` also must be defined.` +
                `Set \`default_atoms_group = true\` in \`uranio.toml\``);
        }
    }
}
//# sourceMappingURL=server.js.map