/**
 * Module for default client env object
 *
 * @packageDocumentation
 */
import { ClientEnvironment } from './types';
/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-core/env/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
export declare const core_client_env: Required<ClientEnvironment>;
