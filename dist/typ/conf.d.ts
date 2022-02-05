/**
 * Config types module
 *
 * @packageDocumentation
 */
import { RequiredConfigParams, OptionalConfigParam } from './intra';
export declare type Database = 'mongo';
export declare type Storage = 'aws';
export declare type Configuration = RequiredConfigParams & Partial<OptionalConfigParam>;
