/**
 * Config types module
 *
 * @packageDocumentation
 */

import {RequiredConfigParams, OptionalConfigParam} from './intra';

export type Database = 'mongo'; // | 'mysql'

export type Storage = 'aws'; // | 'gcloud' | 'localhost'

export type Configuration = RequiredConfigParams & Partial<OptionalConfigParam>;
