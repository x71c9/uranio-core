"use strict";
/**
 * Conf module
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
exports.set = exports.set_initialize = exports.is_initialized = exports.get_current = exports.get = exports.defaults = void 0;
// import fs from 'fs';
// import minimist from 'minimist';
// import toml from 'toml';
// import {urn_log, urn_util, urn_exception} from 'urn-lib';
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONF_CORE_CLIENT_MODULE', `Core client configuration module`);
const default_conf_1 = require("../client/default_conf");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return default_conf_1.core_client_config; } });
const env = __importStar(require("../env/client"));
let _is_client_core_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return default_conf_1.core_client_config[param_name];
}
exports.get = get;
function get_current(param_name) {
    const pro_value = get(param_name);
    if (env.is_production()) {
        return pro_value;
    }
    if (param_name.indexOf('log_') !== -1) {
        const dev_param = param_name.replace('log_', 'log_dev_');
        const dev_value = get(dev_param);
        if (typeof dev_value === typeof default_conf_1.core_client_config[dev_param]) {
            return dev_value;
        }
    }
    return pro_value;
}
exports.get_current = get_current;
function is_initialized() {
    return _is_client_core_initialized;
}
exports.is_initialized = is_initialized;
function set_initialize(is_initialized) {
    _is_client_core_initialized = is_initialized;
}
exports.set_initialize = set_initialize;
function set(repo_config, config) {
    _validate_config_types(repo_config, config);
    for (const [conf_key, conf_value] of Object.entries(config)) {
        repo_config[conf_key] = conf_value;
    }
    // Object.assign(repo_config, config);
}
exports.set = set;
// export function set_from_env(repo_config:Required<types.ClientConfiguration>):void{
//   const config = _get_env_vars(repo_config);
//   set(repo_config, config);
// }
// export function set_from_file(repo_config:Required<types.ClientConfiguration>):void{
//   let toml_config_path = './uranio.toml';
//   const args = minimist(process.argv.slice(2));
//   if(args.c){
//     toml_config_path = args.c;
//   }
//   if(!fs.existsSync(toml_config_path)){
//     urn_log.warn(`Missing TOML configuration file.`);
//     return;
//   }
//   try{
//     const toml_data = fs.readFileSync(toml_config_path);
//     const parsed_toml = toml.parse(toml_data.toString('utf8'));
//     const converted_toml = _conver_toml(parsed_toml);
//     set(repo_config, converted_toml);
//   }catch(err){
//     throw urn_exc.create(
//       `IVALID_TOML_CONF_FILE`,
//       `Invalid toml config file.`,
//       err as Error
//     );
//   }
// }
// function _conver_toml(parsed_toml:any):Partial<types.ClientConfiguration>{
//   const converted_config:Partial<types.ClientConfiguration> = {};
//   for(const [key, value] of Object.entries(parsed_toml)){
//     if(value === null || value === undefined){
//       continue;
//     }
//     if(typeof value === 'object'){
//       _convert_subobject(converted_config, key, value);
//     }else{
//       (converted_config as any)[key] = value;
//     }
//   }
//   return converted_config;
// }
// function _convert_subobject(config:Partial<types.ClientConfiguration>, key:string, obj:any){
//   for(const [subkey, subvalue] of Object.entries(obj)){
//     if(subvalue === null || subvalue === undefined){
//       continue;
//     }
//     if(typeof subvalue === 'object'){
//       _convert_subobject(config, subkey, subvalue);
//     }else{
//       (config as any)[`${key}_${subkey}`] = subvalue;
//     }
//   }
//   return config;
// }
function _check_if_param_exists(param_name) {
    return urn_lib_1.urn_util.object.has_key(default_conf_1.core_client_config, param_name);
}
function _check_if_uranio_was_initialized() {
    if (is_initialized() === false) {
        throw urn_exc.create_not_initialized(`NOT_INITIALIZED`, `Uranio was not initialized. Please run \`uranio.init()\` in your main file.`);
    }
}
function _validate_config_types(repo_config, config) {
    for (const [config_key, config_value] of Object.entries(config)) {
        const key = config_key;
        if (typeof config_value !== typeof repo_config[key]) {
            throw urn_exc.create_not_initialized(`INVALID_CLIENT_CONFIG_VALUE`, `Invalid client config value for \`${config_key}\`. \`${config_key}\` value ` +
                ` must be of type \`${typeof repo_config[key]}\`,` +
                `\`${typeof config_value}\` given.`);
        }
    }
}
// function _get_env_vars(repo_config:types.ClientConfiguration):types.ClientConfiguration{
//   if(
//     typeof process.env.URN_LOG_LEVEL === 'number'
//     || typeof process.env.URN_LOG_LEVEL === 'string'
//     && process.env.URN_LOG_LEVEL !== ''
//   ){
//     repo_config.log_level = Number(process.env.URN_LOG_LEVEL);
//   }
//   return repo_config;
// }
//# sourceMappingURL=client.js.map